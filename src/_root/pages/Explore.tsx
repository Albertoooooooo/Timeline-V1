import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useDebounce from '@/hooks/useDebouce';
import { useGetFilterPosts, useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

export type FilterResultsProps = {
  isFilterFetching: boolean;
  filteredPosts: any;
}

const SearchResults = ({ isSearchFetching, searchedPosts}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    )
  }
}

const FilterResults = ({ isFilterFetching, filteredPosts }: FilterResultsProps) => {
  if (isFilterFetching) {
    return <Loader />
  } else if (filteredPosts && filteredPosts.documents.length > 0) {
    return <GridPostList posts={filteredPosts.documents} />
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No filtered posts</p>
    )
  }
}

const Explore = () => {
  const [searchValue, setSearchValue] = useState("")
  const debouncedValue = useDebounce(searchValue, 500);
  const [selectedFilter, setSelectedFilter] = useState("latest");
  const currentFilter = selectedFilter
  console.log(currentFilter)

  const { data: posts, isFetching: isALlFetching } = useGetPosts();

  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);
  const { data: oldestPosts, isFetching: isOldestFetching } = useGetFilterPosts(currentFilter);

  console.log("all posts:", posts)


  


  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = shouldShowSearchResults

  if (searchValue) {
    console.log("search value active")
  } else if (currentFilter === "all") {
    console.log("all posts active")
  } else if (currentFilter === "oldest") {
    console.log("oldest posts active")
  } else {
    console.log("something else active")
  }

  console.log(shouldShowPosts)
  console.log("initial filter: ", currentFilter)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-primary">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(event) => {
              const { value } = event.target
              setSearchValue(value)}
            }
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Explore</h3>

        <div className="flex-center gap-3 bg-primary rounded-xl px-4 py-2 cursor-pointer">
          {/* <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          /> */}
          <Select onValueChange={(value) => setSelectedFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent className="bg-primary">
              <SelectItem value="latest" className="ui-select-hover">Latest</SelectItem>
              <SelectItem value="oldest" className="ui-select-hover">Oldest</SelectItem>
              <SelectItem value="most-viewed" className="ui-select-hover">Popular</SelectItem>
              <SelectItem value="most-liked" className="ui-select-hover">Most Liked</SelectItem>
              {/* <SelectItem value="popular" className="ui-select-hover">Popular</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults 
          isSearchFetching={isSearchFetching}
          searchedPosts={searchedPosts}
          
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) :  (
          (oldestPosts ? (
            <GridPostList posts={oldestPosts?.documents}/>
          ) : (
            <Loader />
          ))
        )}
      </div>
    </div>
  )
}

export default Explore