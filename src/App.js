import * as React from 'react';
//Global Variables


//Functions
const getTitle = (title) => (title);


//Components
const List = ({list}) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = ({item}) => (
  <li>
    <span>
        <a href={item.url}>{item.title}</a>
    </span>
    <span>
      {item.author}
    </span>
    <span>
      {item.num_comments}
    </span>
    <span>
      {item.points}
    </span>
  </li>
)

const Search = ({onSearch, search}) => (
    <div>
      <label htmlFor='search'> Search: </label>
        <input id="search" type="text" onChange={onSearch} value={search}/>
    </div>
);



//Parent Component
const App = () => {

  //variable
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  //React state
  const [searchTerm, setSearchTerm] = React.useState('React');

  //handle change
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }

  //Callback handler
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //filtering stories
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
  <div>
      <h1>{getTitle("My Hacker Stories")}</h1>
      < Search search={searchTerm} onSearch={handleSearch}/>
      <hr/>
      < List list={searchedStories}/>
    </div>
  );
  };
export default App;
