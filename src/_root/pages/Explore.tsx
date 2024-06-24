import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useDebounce from '@/hooks/useDebouce';
import { useGetFilterPosts, useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

const pageSize = 15;

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

const getPaginationItems = (currentPage: number, totalPages: number, pageSize = 6) => {
  const totalNumbers = pageSize;
  const totalBlocks = totalNumbers + 2; // Adding 2 for the ellipses

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    let pages = [];

    // Handle ellipsis on the left side
    if (startPage > 2) {
      pages.push(1, 'ellipsis-left');
    } else {
      pages.push(1);
    }

    // Pages between startPage and endPage
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Handle ellipsis on the right side
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-right', totalPages);
    } else {
      pages.push(totalPages);
    }

    return pages;
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
};


const Explore = () => {
  const [searchValue, setSearchValue] = useState("")
  const debouncedValue = useDebounce(searchValue, 500);
  const [selectedFilter, setSelectedFilter] = useState("latest");
  const currentFilter = selectedFilter;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(currentFilter)

  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue, currentPage, pageSize);
  const { data: filteredPosts, isFetching: isFilteredFetching } = useGetFilterPosts(currentFilter, currentPage, pageSize);

  useEffect(() => {
    if (filteredPosts) {
      setTotalPages(Math.ceil(filteredPosts.total / pageSize))
    } else if (searchedPosts) {
      setTotalPages(Math.ceil(searchedPosts.total/ pageSize))
    }
  }, [filteredPosts, searchedPosts])

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue, selectedFilter])

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!filteredPosts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = shouldShowSearchResults
  const paginationItems = getPaginationItems(currentPage, totalPages);

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
        <h3 className="body-bold md:h3-bold">{searchedPosts ? ("Results") : ("Explore")}</h3>

        {!searchedPosts ? (
          <div className="flex-center gap-3 bg-primary rounded-xl px-4 py-2 cursor-pointer">
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
        )
        : ("")}
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
          (filteredPosts ? (
            <GridPostList posts={filteredPosts?.documents}/>
          ) : (
            <Loader />
          ))
        )}
      </div>

      <Pagination className="mt-14">
        <PaginationContent className="flex">
          {currentPage !== 1 && (
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          {paginationItems.map((page, index) => (
            <PaginationItem key={index} className={currentPage === page ? 'invert-cyan rounded-lg' : 'invert-white rounded-lg'}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink href="#" onClick={() => handlePageChange(page)}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Explore