echo "Starting OS X - 64-bit build of FireNote"
rm -Rf /build/darwin64
mkdir -pv ./build/darwin64/
electron-packager . FireNote --platform=darwin --arch=all --out=/tmp/firenote/build/
zip -r --symlinks build/darwin64/FireNote.app.zip /tmp/firenote/build/FireNote-darwin-x64/*
rm -Rf /tmp/firenote/build/
echo "The output can be found in /build/darwin64 if the build succeeded, and the file should be called FireNote.app.zip"