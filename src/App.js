import * as React from 'react';
import axios
 from 'axios';
import { type } from '@testing-library/user-event/dist/type';
//Global Variables


//Functions
const getTitle = (title) => (title);
const API_Endpoint = 'https://hn.algolia.com/api/v1/search?query=';

//Reducer
const storiesReducer = (state, action) => {
  switch(action.type){
    case 'STORIES_FETCH_INIT':
      return{
        ...state,
        isLoading:true,
        isError:false,
      }
    case 'STORIES_FETCH_SUCCESS':
      return{
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return{
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return{
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

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

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value="{searchTerm}"
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button
    type="submit"
    disabled={!searchTerm}
    >
    Submit
    </button>
  </form>
);

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

  //Making url stateful
  const [url, setUrl] = React.useState(`${API_Endpoint}${searchTerm}`);

  //Converting list to use reducer
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data:[], isLoading: false, isError: false}
  );

  //Memoized Function
  const handleFetchStories = React.useCallback(async () => {
    
    dispatchStories({ type: 'STORIES_FETCH_INIT'});

    try{
      const result = await axios.get(url);
  
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      });
    } catch {
      dispatchStories({
        type:'STORIES_FETCH_FAILURE'
      })
    }

  },[url]);

  React.useEffect(() => {
    handleFetchStories();
  },[handleFetchStories]);

  //handles user input by saving it in state
  const handleSearchInput = (event) =>{
    setSearchTerm(event.target.value);
  };

  //sets urls when 
  const handleSearchSubmit = (event) => {
    setUrl(`${API_Endpoint}${searchTerm}`);
    event.preventDefault();
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  return(
  <div>
      <h1>{getTitle("My Hacker Stories")}</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />
      { stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
      <p> Loading...</p>
      ) : (
        < List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory}
        />
      )}
      
    </div>
  );
  };
export default App;
