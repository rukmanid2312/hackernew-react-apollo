import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FEED_QUERY } from './LinkList';

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;
const CreateLink=()=>{
    const navigate = useNavigate();
    const [formData,setFormData]=useState({
        link:'',
        description:''
    });
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
          description: formData.description,
          url: formData.link
        },
        update: (cache, { data: { post } }) => {
          const data = cache.readQuery({
            query: FEED_QUERY,
          });
    
          cache.writeQuery({
            query: FEED_QUERY,
            data: {
              feed: {
                links: [post, ...data.feed.links]
              }
            },
          });
        },
        onCompleted: () => navigate('/')
      });

    return(
        <div>
                 <form onSubmit={(e)=>{e.preventDefault();   createLink();}}>
                 <div className="flex flex-column mt3">
                    <input 
                    type="text"
                    className='mb2'
                    placeholder="A description for the link"
                    value={formData.description}
                    onChange={
                        (e)=>{
                            setFormData({...formData,description:e.target.value});
                        }
                    }
                    />
                      <input 
                    type="text"
                    className='mb2'
                    placeholder="The URL for the link"
                    value={formData.url}
                    onChange={
                        (e)=>{setFormData({...formData,url:e.target.url})}
                    }
                    />

                 </div>
                <button type="submit">Submit</button>

                </form>
        </div>
   
    )
} ;
export default CreateLink;