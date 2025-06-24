## build arm64
```
cd frontend
docker build --platform linux/arm64 -t [image-name]:[tagname] .
docker push [image-name]:[tagname]
cd ../backend
docker build --platform linux/arm64 -t [image-name]:[tagname] .
docker push [image-name]:[tagname]
```