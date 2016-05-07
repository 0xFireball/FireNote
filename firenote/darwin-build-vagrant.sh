APPNAME="FireNote"

echo "Starting OS X - 64-bit build of $APPNAME"
rm -Rf ./build/darwin64
mkdir -pv ./build/darwin64/
electron-packager . $APPNAME --platform=darwin --arch=all --out=/tmp/$APPNAME/build/
rm /tmp/$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns
cp ./img/$APPNAME.icns /tmp/$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns

CURRENTPATH=$(pwd)
cd /tmp/$APPNAME/build/$APPNAME-darwin-x64/

zip -r -9 --symlinks $CURRENTPATH/build/darwin64/$APPNAME.app.zip $APPNAME.app
cd $CURRENTPATH
rm -Rf /tmp/$APPNAME/build/
echo "The output can be found in /build/darwin64 if the build succeeded, and the file should be called $APPNAME.app.zip"