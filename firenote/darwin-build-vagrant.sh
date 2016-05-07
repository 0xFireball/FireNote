APPNAME="FireNote"
BUILD_DIR="$HOME/tmp"
OUTPATH="build/darwin64"

echo "Starting OS X - 64-bit build of $APPNAME"
rm -Rf ./build/darwin64
mkdir -pv ./$OUTPATH/

echo "Running Electron Packager..."
electron-packager . $APPNAME --platform=darwin --arch=all --out=$BUILD_DIR/$APPNAME/build/
echo "Replacing Icon..."
rm $BUILD_DIR/$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns
cp ./img/$APPNAME.icns $BUILD_DIR/$APPNAME/build/$APPNAME-darwin-x64/$APPNAME.app/Contents/Resources/electron.icns

CURRENTPATH=$(pwd)
cd $BUILD_DIR/$APPNAME/build/$APPNAME-darwin-x64/

ARCPATH="$CURRENTPATH/$OUTPATH/$APPNAME.app.zip"
echo "Compressing to $ARCPATH"
zip -r -9 --symlinks $ARCPATH $APPNAME.app > /dev/null
cd $CURRENTPATH

echo "Cleaning Up..."
rm -Rf $BUILD_DIR/$APPNAME/build/
echo "The output can be found in /build/darwin64 if the build succeeded, and the file should be called $APPNAME.app.zip"
echo "Working Directory: $(pwd)"