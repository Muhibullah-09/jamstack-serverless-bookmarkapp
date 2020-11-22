import React from "react"
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import './index.css';
import Card from '../components/card';

const BookMarksQuery = gql`{
  bookmark{
    id
    url
    desc
  }
}`

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!){
    addBookmark(url: $url, desc: $desc){
     url 
    }
}
`

export default function Home() {
  let textfield;
  let desc;

  const { loading, error, data } = useQuery(BookMarksQuery)
  const [addBookmark] = useMutation(AddBookMarkMutation)

  const addBookmarkSubmit = () => {
    console.log('textfield', textfield.value)
    console.log('Desc', desc.value)
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value
      },
      refetchQueries: [{ query: BookMarksQuery }]
    })
  }
  if (error)
    return <h3>{error}</h3>

  if (loading)
    return <h3>Loading...</h3>
  return (
    <div className="container">

      <h2>Add New Bookmark</h2>
      <label>
        Enter Bookmark Description: <br />
        <input type="text" placeholder="Description" ref={node => desc = node} />
      </label>

      <br />
      <label>
        Enter Bookmark Url: <br />
        <input type="text" placeholder="Enter a valid URL" ref={node => textfield = node} />
      </label>

      <br />
      <br />
      <button onClick={addBookmarkSubmit}>Add Bookmark</button>

      <h2>My Bookmark List</h2>

      <div className="card-container">
        {data.bookmark.map((bm) => <Card url={bm.url} title={bm.desc} />)}
      </div>
    </div>
  )

}


    //   {/* <p>{JSON.stringify(data)}</p> */}
    //   <div>
    //     <input type="text" placeholder="URL" ref={node => textfield = node} />
    //     <input type="text" placeholder="Description" ref={node => desc = node} />
    //     <button onClick={addBookmarkSubmit}>Add BookMark</button>
    //     <div>
    //       {data.bookmark.url}
    //       {data.bookmark.desc}
    //     </div>
    //   </div>
    // </div>
