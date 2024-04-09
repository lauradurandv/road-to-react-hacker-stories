import * as React from 'react';
//Global Variables


//Functions
const getTitle = (title) => (title);

const initialStories = [
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

//Components
const List = ({list, onRemoveItem}) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({item, onRemoveItem}) => (
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
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

const InputWithLabel = ({ id, value, type='text', onInputChange, isFocused, children }) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if(isFocused && inputRef.current){
      inputRef.current.focus();
    }
  }, [isFocused])

  return(
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

//Handles syncing value of any local storage with state based on unique key id
  const useStorageState = (key, initialState) => {

    const [value, setValue] = React.useState(localStorage.getItem('value') || initialState);

    React.useEffect(() => {
    localStorage.setItem('value', value);
    }, [value]);

    return [value, setValue];

  }


//Parent Component
const App = () => {

  //Synchronize browser local storage with state
  const [searchTerm, setSearchTerm] = useStorageState('search','React');
  
  //Making list stateful
  const [stories, setStories] = React.useState(initialStories)


  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );

    setStories(newStories);
  }

  //Callback handler
  const handleSearch = (event) => {
    //save input with state
    setSearchTerm(event.target.value);
  };

  //filtering stories
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
  <div>
      <h1>{getTitle("My Hacker Stories")}</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      < List list={searchedStories} onRemoveItem={handleRemoveStory}/>
    </div>
  );
  };
export default App;
