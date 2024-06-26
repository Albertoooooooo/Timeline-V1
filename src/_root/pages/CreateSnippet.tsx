import SnippetForm from '@/components/forms/SnippetForm'
import Button from '@/components/ui/button'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const CreateSnippet = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const navigate = useNavigate();

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="add"
          />
          <h2 className="h3-bold md: h2-bold text-left w-full">Create Snippet</h2>
        </div>

        <SnippetForm action="Create" post={post}/>
      </div>
    </div>
  )
}

export default CreateSnippet