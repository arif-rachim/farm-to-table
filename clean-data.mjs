import dirTree from "directory-tree";
import fs from "fs";
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
            // if(child.children.length > 0 && child.children[0].name.indexOf('.jpg')>0){
            //     // File destination.txt will be created or overwritten by default.
            //     fs.copyFile(child.path+`/${child.children.length}.jpg`, child.path+'/default.jpg', (err) => {
            //         if(err){
            //             console.log(err);
            //         }
            //     });
            // }

        }else{
            if(child.name.endsWith('.jpg') && child.path.indexOf('/HR/') > 0){

                const folder = child.path.replace(child.name,'');
                const thumbFolder = folder.replace('HR','THUMB');
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
                /*
                try {
                    const thumbnailInfo = await thumbnail({
                        src: child.path,
                        dst : thumbFolder+child.name,
                        width: 100,
                        height: 200,
                        quality : 100
                    });

                    console.log("Thumbnail is at: " + thumbnailInfo.path);
                } catch (e) {
                    console.log("Error: ", e);
                }
                */
            }

        }
    }
}
await checkFolder(tree.children);
