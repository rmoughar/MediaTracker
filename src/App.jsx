
//App.jsx
import './App.css';
import { useState, useEffect} from 'react';

function App() {
    //Local Storage Custom Hook

  function getStorageValue(key, defaultValue){
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved);
    return initial || defaultValue;
  }

  const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
      return getStorageValue(key, defaultValue);
    });

      useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];

  }

  const [mediaList, setMediaList] = useLocalStorage("mediaList", []); 
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({title:'', stat:'', type:'', tags: [], notes: ''});

  const [title, setTitle] = useState('');
  const [stat, setStat]   = useState('');
  const [type, setType]   = useState('');
  const [notes, setNotes] = useState('');

  const [globalTags, setGlobalTags] = useLocalStorage("globalTags", []);
  const [tagInput, setTagInput] = useState('');
  const [newItemTags, setNewItemTags] = useState([]);
  const [editTagData, setEditTagData] = useState(globalTags);
  const [isEditingTags, setisEditingTags] = useState(false);
  const [nextTagID, setNextTagID] = useLocalStorage("nextTagID", 1);





  //Meida Creation
  const handleSubmit = (e) => {
    e.preventDefault();

    const newMedia = {id: Date.now(), title, stat, type, tags: newItemTags, notes};
    setMediaList([...mediaList, newMedia]);
    
  }

  function deleteMedia(itemId) {
    const newArray = mediaList.filter(item => item.id !== itemId);
    setMediaList(newArray);
  }

  //Media /Editing
  function startEdit(item){
    setEditFormData({title: item.title, stat: item.stat, type: item.type, tags: item.tags, notes: item.notes})
    setEditId(item.id);
  }

  function saveEdit(itemId) {
    
    setMediaList((prevList) => prevList.map((item) => item.id === itemId ? {...item, ...editFormData} : item));

    setEditFormData({title:'', stat:'', type:'', tags: [], notes: ''});
    setEditId(null);
  }

  function cancelEdit() {
    setEditFormData({title:'', stat:'', type:'', tags: [], notes: ''});
    setEditId(null);
  }


  //Tag Creation
  function handleTagSubmit(e) {
    e.preventDefault();

    if(tagInput.label && !globalTags.some(tag => tag.label === tagInput.label)){
      setGlobalTags([...globalTags, tagInput]);
      
    }
    setTagInput('');
    setNextTagID(nextTagID + 1);
  }

  function startTagEdit() {
    setisEditingTags(true);
    setEditTagData(globalTags.map(tag => ({...tag})));
  }


  //Tag Editing
  function handleTagEdit(e, index) {
    const newList = [...editTagData];
    newList[index] = {...newList[index], label: e.target.value};
    setEditTagData(newList);
  }

  function handleTagEditSave() {
    setGlobalTags(editTagData);
    setisEditingTags(false);
  }

  function handleTagEditCancel() {
    setEditTagData(globalTags);
    setisEditingTags(false);
  }

  return (
    <div className='app-container'>
    <h1>Add New Tags</h1>
      <form onSubmit={handleTagSubmit}>
        <label htmlFor='tag'>Tag: </label>
        <input type="text" id='title'  name="tag" placeholder='Enter Tag Here' onChange={(e) => setTagInput({id: nextTagID, label: e.target.value})}></input>

        <button type="submit">Submit</button>
      </form>
      
      

    
      <h2>Add New Media</h2>
      <form onSubmit={handleSubmit}>
        <div className='.new-media'>
          
          <label htmlFor='title'>Title: </label>
          <input type="text" id="title" name="title" placeholder='Title' onChange={(e) => setTitle(e.target.value)}></input>
          
          <label htmlFor='stat'> Status: </label>
          <input type="text" id="stat" name="stat" placeholder='Status' onChange={(e) => setStat(e.target.value)}></input>
          
          <label htmlFor='type'> Type: </label>
          <input type="text" id="type" name="type" placeholder='Type' onChange={(e) => setType(e.target.value)}></input>
          
          
        </div>
      
      
        

        {isEditingTags ? (
          <>
          {editTagData.map((tag,index) => (
              <div key={index}>
                <input type='text' value={tag.label} onChange={(e) => handleTagEdit(e, index)}></input>
                <button className='x-button' type='button' onClick={(e) => {
                  e.preventDefault();
                  setEditTagData(editTagData.filter((_, i) => i !== index));
                }}>❌</button>
              </div>
            ))}
            <button type='button' onClick={() => handleTagEditSave()}>Save Tags</button>
            <button type='button' onClick={() => handleTagEditCancel()}>Cancel Edit</button>
          </>
        ) : (
          
          <div className='tag-select-box'>
            <h3>Select Tags:</h3>
            <div className='tag-grid'>
              
              {globalTags.map(tag => (
                <label key={tag.id} className={`tag-button ${newItemTags.includes(tag.id) ? 'selected' : ''}`}>
                {tag.label}
                <input type='checkbox'  value={tag.label} checked={newItemTags.includes(tag.id)} onChange={(e) => {
                  const checked = e.target.checked;
                  const id = tag.id
                  
                  if(checked){
                    setNewItemTags([...newItemTags, id]);
                  }
                  else{
                    setNewItemTags(newItemTags.filter(t => t !== id));
                  }
                }}
                hidden
                ></input>
              </label>
              ))}
              
            </div>
            <div className='tag-box-actions'>
              <button type="button" onClick={() => setNewItemTags([])}>Reset</button>
              <button type="button" onClick={() => startTagEdit()}>Edit Tags</button>
            </div>
          </div>
        )}
      
                  
        <h3>Add Notes:</h3>
        <input type="text" id="notes" name="notes" placeholder='Notes' onChange={(e) => setNotes(e.target.value)}></input>

        <div className='submit-new-media-box'>
          <button className= 'submit-new-media-button' type="submit">Add To List</button>
        </div>
      </form>

      
      

      <h3>My List</h3>
      <div className='media-grid'>
        {mediaList.map((item) => (
          <li key={item.id}>
                {editId === item.id ? (
                  //Edit Mode where we show input fields instead of plain text
                  <div className='entry'> 
                    <input value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}/>

                    <input value={editFormData.stat} onChange={(e) => setEditFormData({...editFormData, stat: e.target.value})}/>

                    <input value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}/> 

                    <p>Edit Tags: </p>
                    {globalTags.map(tag => {
                      const checked = editFormData.tags.includes(tag.id);

                      return(
                        <label key={tag.id}>
                          {tag.label}
                          <input type='checkbox' checked={checked} onChange={(e) => {
                            const isChecked = e.target.checked;
                            if(isChecked){
                              setEditFormData({...editFormData, tags: [...editFormData.tags, tag.id]})
                            }
                            else{
                              setEditFormData({...editFormData, tags: editFormData.tags.filter(id => tag.id !== id)})
                            }
                          }}></input></label>
                      )
                    })}

                    <p>Edit Notes: </p>
                    <input value={editFormData.notes} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}/>


                    <button onClick={() => saveEdit(item.id)}> Save</button>
                    <button onClick={cancelEdit}> Cancel</button>
                  </div>
                ) : (
                    //Normal Mode
                  <div className='entry'>
                    {item.title} ({item.stat}) - {item.type}
                    <div>
                      Tags: {
                      item.tags.length > 0 ? item.tags.map (id => {
                        const tag = globalTags.find(t => t.id === id);
                        return tag ? tag.label : "";
                      }).join(', ')
                    : "None"
                    }
                    </div>
                    <div>
                      Notes: 
                      {item.notes == '' ? ' None' : [` ` + item.notes]}
                    </div>
                    <button onClick={() => startEdit(item)}> Edit</button>
                    <button onClick={() => deleteMedia(item.id)}> Delete</button>
                  </div>
                  )} 
          </li>
        ))}
        </div>
    </div>
  );
}

export default App;