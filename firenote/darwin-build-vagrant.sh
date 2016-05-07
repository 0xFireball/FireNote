echo "Starting OS X - 64-bit build of FireNote"
rm -Rf ./build/darwin64
mkdir -pv ./build/darwin64/
electron-packager . FireNote --platform=darwin --arch=all --out=/tmp/firenote/build/
rm /tmp/firenote/build/FireNote-darwin-x64/FireNote.app/Contents/Resources/electron.icns
cp ./img/firenote.icns /tmp/firenote/build/FireNote-darwin-x64/FireNote.app/Contents/Resources/electron.icns
CURRENTPATH=$(pwd)
cd /tmp/firenote/build/FireNote-darwin-x64/
zip -r -9 --symlinks $CURRENTPATH/build/darwin64/FireNote.app.zip FireNote.app
cd $CURRENTPATH
rm -Rf /tmp/firenote/build/
echo "The output can be found in /build/darwin64 if the build succeeded, and the file should be called FireNote.app.zip"