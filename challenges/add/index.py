import sys

if (add(2, 2) != 4) :
  print(f'expected 4 but was {add(2, 2)}', file=sys.stderr)
  sys.exit(1)
 

if (add(2, 3) != 5) :
  print(f'expected 5 but was {add(2, 3)}', file=sys.stderr)
  sys.exit(1)
 

