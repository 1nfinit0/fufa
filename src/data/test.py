a = 1

def imprime():
  print("impreso")

try:
  
  if a != 1:
    imprime()
  
  else: pass
  
except Exception as e:
  print(f"Exception: {e}")