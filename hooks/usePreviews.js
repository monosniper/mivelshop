import {list} from "ya-disk";
import {useState} from "react";

export default function usePreviews(preview=false) {
    const [previews, setPreviews] = useState({});

    const get = () => {
        list(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, {limit: 999999}).then(rs => {
            const newItems = {}
            console.log(rs.items)
            rs.items.filter(item => item.path.indexOf(process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME) !== -1).forEach(item => {
                // const uuid = item.name.split('.')[0]
                const uuid = item.path.split('/')[2]
                if(!Array.isArray(newItems[uuid])) newItems[uuid] = []
                // newItems[uuid] = item[preview ? 'preview' : 'file']
                newItems[uuid].push(item[preview ? 'preview' : 'file'])
                // newItems[uuid].push(item.path)
            })
            console.log(newItems)

            setPreviews(newItems)
        });
    }

    return [previews, get]
}