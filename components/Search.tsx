"use client"
import Image from "next/image"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getFiles } from "@/lib/actions/file.actions"
import { Models } from "node-appwrite"
import ThumbNail from "./ThumbNail"
import FormatedDateTime from "./FormatedDateTime"
import { useDebounce } from "use-debounce"

const Search = () => {
  const [query,setQuery] = useState("")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const [results,setResults] = useState<Models.Document[]>([])
  const [open,setOpen] = useState(false)
  const path = usePathname()
  const router =useRouter()
  const [deBouncedQuery] = useDebounce(query, 300);
  useEffect(()=>{
    const fetchFiles = async()=>{
      if(deBouncedQuery.length === 0){
        setResults([])
        setOpen(false)
        return router.push(path.replace(searchParams.toString(),""))
      }
      const files = await getFiles({types:[],searchText:deBouncedQuery})
      setResults(files.documents)
      setOpen(true)
    }
    fetchFiles()
  },[deBouncedQuery,path,router,searchParams])

  useEffect(()=>{
    if(!searchQuery){
      setQuery("")
    }
  },[searchQuery])

const handleClickItem = (file:Models.Document)=>{
  setOpen(false)
  setResults([])
  router.push(`/${(file.type === "video" || file.type === "audio" ) ? "media":file.type+ "s"}?query=${query}`)
}

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={()=>handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <ThumbNail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">{file.name}</p>
                  </div>
                  <FormatedDateTime date={file.$createdAt} className="caption line-clamp-1 text-light-200" />
                </li>
              ))
            ) : (
              <p className="empty-result">No file found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
export default Search