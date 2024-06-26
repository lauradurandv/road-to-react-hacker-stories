import * as React from 'react';
import axios
 from 'axios';
import { type } from '@testing-library/user-event/dist/type';
//Styling to fall back on
import './index.css';
//Main styling
//import styles from './App.module.css';
//for component styling
import styled from 'styled-components';
import {ReactComponent as Check} from './check.svg';



//Global Variables


//Functions
const getTitle = (title) => (title);
const API_Endpoint = 'https://hn.algolia.com/api/v1/search?query=';

const StyledContainer = styled.div`
  height:100vw;
  padding: 20px;

  background:#83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const StyledItem = styled.li`
  display: flex;
  align-item: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-top: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  fonts-size: 24px;
`;

 
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
  <StyledItem>
    <StyledColumn style={{ width: '40%'}}>
        <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn style={{ width: '30%'}}>
      {item.author}
    </StyledColumn>
    <StyledColumn style={{ width: '10%'}}>
      {item.num_comments}
    </StyledColumn>
    <StyledColumn style={{ width: '10%'}}>
      {item.points}
    </StyledColumn>
    <span style={{ width: '10%'}}>
      <StyledButtonSmall 
        type="button" 
        onClick={() => onRemoveItem(item)}
      >
        <Check height="18px" width="18px" />
      </StyledButtonSmall>
    </span>
  </StyledItem>
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
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      <StyledInput
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
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value="{searchTerm}"
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <StyledButtonLarge
    type="submit"
    disabled={!searchTerm}
    >
    Submit
    </StyledButtonLarge>
  </StyledSearchForm>
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
  <div >
    <StyledContainer>
      <StyledHeadlinePrimary>{getTitle("My Hacker Stories")}</StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

  
      { stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
      <p> Loading...</p>
      ) : (
        < List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory}
        />
      )}
    </StyledContainer>
    </div>
  );
  };
export default App;
