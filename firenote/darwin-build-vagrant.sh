APPNAME="FireNote"
BUILD_DIR="$HOME/tmp/"

echo "Starting OS X - 64-bit build of $APPNAME"
rm -Rf ./build/darwin64
mkdir -pv ./build/darwin64/

echo "Running Electron Packager..."
electron-packager . $APPNAME --platform=darwin --arch=all --out=BUILD_DIR$APPNAME/build/
echo "Replacing Icon..."
rm BUILD_DIR$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns
cp ./img/$APPNAME.icns BUILD_DIR$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns

CURRENTPATH=$(pwd)
cd BUILD_DIR$APPNAME/build/$APPNAME-darwin-x64/

ARCPATH="$CURRENTPATH/build/darwin64/$APPNAME.app.zip"
echo "Compressing to $ARCPATH"
zip -r -9 --symlinks $ARCPATH $APPNAME.app
cd $CURRENTPATH

echo "Cleaning Up..."
rm -Rf BUILD_DIR$APPNAME/build/
echo "The output can be found in /build/darwin64 if the build succeeded, and the file should be called $APPNAME.app.zip"
echo "Working Directory: $(pwd)"