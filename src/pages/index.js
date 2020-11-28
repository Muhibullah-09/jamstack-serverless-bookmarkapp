import React from "react"
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Container, Button, Input, Label, Heading } from 'theme-ui';
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
    return <Heading sx={{ color: 'black', fontFamily: 'monospace' , textAlign:"center"}}>{error}</Heading>

  if (loading)
    return <Heading sx={{ color: 'black', fontFamily: 'monospace' , textAlign:"center"}}>Loading...</Heading>
  return (
    <div>
    <Heading sx={{ color: 'black', fontFamily: 'monospace' , textAlign:"center"}}>BookMark App</Heading>
    <Container   p={4} bg='muted'>
      <Label sx={{ color: 'black', fontFamily: 'monospace'}} >Enter Bookmark Description:</Label>
      <Input type="text" placeholder="Description" ref={node => desc = node} /><br/>
      <Label sx={{ color: 'black', fontFamily: 'monospace'}} >Enter Bookmark Url:</Label>
      <Input type="text" placeholder="Enter a valid URL" ref={node => textfield = node} /><br/>
      <Button
        sx={{ color: 'red', fontFamily: 'monospace', cursor: 'pointer' }}
        onClick={addBookmarkSubmit}>ADD BOOKMARK
      </Button>
    </Container>
    <Heading sx={{ color: 'black', fontFamily: 'monospace' , textAlign:"center"}}>BookMark List</Heading>
      <div className="card-container card">
        {data.bookmark.map((bm) => <Card url={bm.url} title={bm.desc} />)}
      </div>
    </div>
  )

}