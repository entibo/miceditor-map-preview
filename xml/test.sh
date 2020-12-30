rm 1.png
rm 2.png
rm 3.png
rm 4.png
curl -s -X POST localhost:3000/ -H "Content-Type: application/json" -d "@1.json" --output 1.png &
curl -s -X POST localhost:3000/ -H "Content-Type: application/json" -d "@2.json" --output 2.png &
curl -s -X POST localhost:3000/ -H "Content-Type: application/json" -d "@3.json" --output 3.png &
curl -s -X POST localhost:3000/ -H "Content-Type: application/json" -d "@4.json" --output 4.png &