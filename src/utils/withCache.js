const cacheMap = new Map()
export const withCache = (fn)=>{
    const cache =  cacheMap.get(fn)
    if (cache) return cache
    cacheMap.set(fn,fn())
    return  cacheMap.get(fn)
}