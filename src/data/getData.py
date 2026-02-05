import requests
import pandas as pd # type: ignore
from pathlib import Path
from io import StringIO
import json
from dotenv import load_dotenv # type: ignore
import os
import pyktok as pyk # type: ignore
from TikTokApi import TikTokApi # type: ignore
import time


env_path = Path(__file__).parent / ".env.local"
pathBase = Path(os.getcwd())
load_dotenv(env_path)

CSV_URL = os.getenv("SPREADSHEET_LINK")
OUTPUT_PATH = Path("rawData.json")

print("Path Base:", pathBase)
print("ENV PATH:", env_path)
print("CSV_URL:", CSV_URL)


def main():
    
    __doc__ = """
    Programa de control y manipulación de datos que serán publicados en la web.
    
        Proceso: 
            1. Considerando el documento rawData.json que se descarga al final de este script como actualización de la fuente de verdad a partir del spreadsheet de Google Sheets que servirá como archivo control de en lo que este punto será el proceso "anterior", almacenaremos el nuevo json en una variable temporal con el fin de comparar con su versión anterior.
            
            2. A partir de la comparación entre ambos JSONs, se generarán 3 nuevos JSONs:
                - productosNuevos.json: Contendrá solo los productos que son nuevos en la versión actual respecto a la anterior.
                - productosEliminados.json: Contendrá solo los productos que han sido eliminados en la versión actual respecto a la anterior.
                - productosModificados.json: Contendrá solo los productos que han sido modificados en la versión actual respecto a la anterior.
                
            3. Se realizarán los procesos de descarga de imágenes y videos asociados a los productos nuevos y modificados, almacenándolos en las carpetas correspondientes dentro del proyecto.
            
            4. Finalmente, se actualizará el archivo rawData.json con la nueva versión de los datos para futuras comparaciones.
    """
    
    
    try:
        # New data
        response = requests.get(CSV_URL)
        response.raise_for_status()
        csv_content = response.content.decode("utf-8")

        df = pd.read_csv(
            StringIO(csv_content),
        )

        # OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        json_str = df.to_json(orient="records", indent=2, force_ascii=False)
        json_loaded = json.loads(json_str)
                
        # Old data
        with open(Path(__file__).parent / "rawData.json", "r", encoding="utf-8") as f:
            old_data_json = json.load(f)
            
        print("Las fuentes son iguales:",old_data_json == json_loaded)
    except Exception as e:
        print(f"Error durante el proceso: {e}")

    def productosNuevos(new_json , old_json):
        """
        Devuelve un JSON (lista de dicts) con solo los productos que son nuevos
        en la versión actual respecto a la anterior.
        
        Parámetros:
        - new_json: lista de diccionarios con la versión nueva de productos
        - old_json: lista de diccionarios con la versión anterior de productos
        
        Retorna:
        - lista de diccionarios con los productos nuevos
        """
        old_ids = {item["id"] for item in old_json}
        nuevos = [item for item in new_json if item["id"] not in old_ids]
        
        return nuevos
    

    def productosEliminados(new_json, old_json):
        """
        Devuelve un JSON (lista de dicts) con solo los productos que han sido
        eliminados en la versión actual respecto a la anterior.
        
        Parámetros:
        - new_json: lista de diccionarios con la versión nueva de productos
        - old_json: lista de diccionarios con la versión anterior de productos
        
        Retorna:
        - lista de diccionarios con los productos eliminados
        """
        new_ids = {item["id"] for item in new_json}
        eliminados = [item for item in old_json if item["id"] not in new_ids]
        
        return eliminados


    def productosModificados(new_json, old_json):
        """
        Devuelve un JSON (lista de dicts) con solo los productos que han sido
        modificados en la versión actual respecto a la anterior.
        
        Parámetros:
        - new_json: lista de diccionarios con la versión nueva de productos
        - old_json: lista de diccionarios con la versión anterior de productos
        
        Retorna:
        - lista de diccionarios con los productos modificados (versión nueva)
        """
        # Crear un diccionario de productos antiguos indexados por Código
        old_dict = {item["id"]: item for item in old_json}
        
        modificados = []
        
        for item in new_json:
            codigo = item["id"]
            if codigo in old_dict:
                # Comparar el producto nuevo con el antiguo
                if item != old_dict[codigo]:
                    modificados.append(item)
        
        return modificados
    
    
    
    cantidadPN =  len(productosNuevos(json_loaded, old_data_json))
    cantidadPE =  len(productosEliminados(json_loaded, old_data_json))
    cantidadPM =  len(productosModificados(json_loaded, old_data_json))
    
    #     ❯ python getData.py
    # Las fuentes son iguales: False
    # Productos Nuevos: 15
    # Productos Eliminados: 0
    # Productos Modificados: 0
    
    def makeDirForNewProduct(item):
        imgDir = pathBase / "public" / "media" / item['id'] / "images"
        videoDir = pathBase / "public" / "media" / item['id'] / "videos"
        imgDir.mkdir(parents=True, exist_ok=True)
        videoDir.mkdir(parents=True, exist_ok=True)
    
    print(f"Productos Nuevos: {cantidadPN}")
    
    
    if cantidadPN > 0:
        for producto in productosNuevos(json_loaded, old_data_json):
            try:
                makeDirForNewProduct(producto)
                
                tiktok_url_list = []
                
                tiktok_url_list.append(producto['video1'])
                tiktok_url_list.append(producto['video2'])
                tiktok_url_list.append(producto['video3'])
                tiktok_url_list.append(producto['video4'])
                
                tiktok_url_list = [url for url in tiktok_url_list if url] # Filtrar URLs vacías
                
                os.chdir(pathBase / f"public/media/{producto['id']}/videos")
                
                print(f"Descargando videos para {producto['id']}")
                
                pyk.save_tiktok_multi_urls(
                    tiktok_url_list,
                    True,
                    'data.csv',
                    2
                )
                
                time.sleep(60)  # Pausa de 60 segundos entre descargas
                
                print(f"Videos descargados para {producto['id']}")
                os.chdir(pathBase)
        
            except Exception as e:
                print(f"Error procesando producto {producto.get('id', 'ID desconocido')}: {e}")
                # Asegurarse de volver al directorio base en caso de error
                os.chdir(pathBase) if 'pathBase' in locals() else None
                continue  # Pasar al siguiente producto
            
if __name__ == "__main__":
    main()
