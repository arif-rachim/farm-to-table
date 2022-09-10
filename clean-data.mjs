import dirTree from "directory-tree";
import {execSync} from "child_process";
import fs, {mkdirSync} from "fs";
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import {thumbnail} from "easyimage";

const tree = dirTree('./public/images/');

async function checkFolder(children){
    let index = 0;
    for (const child of children) {
        index++;
        if(child.children && child.children.length > 0){
            await checkFolder(child.children);
            // if(['TRANSPARENT','PNG','THUMB','400'].indexOf(child.name) >= 0){
            //     fs.rmSync(child.path, { recursive: true, force: true });
            // }
            // if(child.children.length > 0 && child.children[0].name.indexOf('.jpg')>0){
            //     // File destination.txt will be created or overwritten by default.
            //     fs.copyFile(child.path+`/${child.children.length}.jpg`, child.path+'/default.jpg', (err) => {
            //         if(err){
            //             console.log(err);
            //         }
            //     });
            // }

        }else{
            if(child.name.endsWith('.png') && child.path.indexOf('/HIRES/') > 0){

                const folder = child.path.replace(child.name,'');
                const thumbFolder = folder.replace('HIRES','400');


                if (!fs.existsSync(thumbFolder)){
                    console.log('CREATING ',thumbFolder)
                    fs.mkdirSync(thumbFolder, { recursive: true });
                }

                console.log('Converting ',child.path);
                //execSync(`convert ${child.path} ${thumbFolder}${child.name.replace('jpg','png')}`,{stdio: 'inherit'});
                // execSync(`convert ${child.path} -fuzz 1% -trim +repage ${thumbFolder}${child.name}`,{stdio: 'inherit'})
                execSync(`convert ${child.path} -thumbnail '400x400>' -density 72 -background transparent -gravity center -extent 400x400 ${thumbFolder}${child.name}`,{stdio: 'inherit'})
                // lets compress this
                /*
                // this is for reducing the image compression
                try{
                    //fs.renameSync(child.path,child.path.replace(child.name,index+'.jpg'));
                    const folder = child.path.replace(child.name,'');
                    const thumbFolder = folder.replace('HR','THUMB');
                    await imagemin([child.path],{glob:false,destination:thumbFolder,plugins: [imageminMozjpeg({quality: 5})]})
                }catch(err){
                    console.log(err);
                }
                */
                // this is for creating thumb nail

                // try {
                //     const thumbnailInfo = await thumbnail({
                //         src: child.path,
                //         dst : thumbFolder+child.name,
                //         width: 100,
                //         height: 200,
                //         quality : 100,
                //         gravity:'center'
                //     });
                //
                //     console.log("Thumbnail is at: " + thumbnailInfo.path);
                // } catch (e) {
                //     console.log("Error: ", e);
                // }

            }

        }
    }
}
await checkFolder(tree.children);
