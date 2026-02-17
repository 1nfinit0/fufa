a = 1

def imprime():
  print("impreso")

try:
  
  if a != 1:
    imprime()
  
  print("Se modifica")
  
except Exception as e:
  print(f"Exception: {e}")