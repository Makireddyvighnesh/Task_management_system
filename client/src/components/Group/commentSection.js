import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ onClose }) {
  const [comment, setComment] = useState({ name: '', comment: '', commentTime: '' });
  const [group, setGroup] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const userObject = JSON.parse(userToken);
      setUser(userObject);
    }
  }, []);

  const handleComment = (e) => {
    const currTime = new Date();
    const formattedTime = currTime.toISOString(); // Format the date as an ISO string
    setComment({ ...comment, name: user.userName, comment: e.target.value, commentTime: formattedTime });
  }


  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/comment/');
      response.data.map(comment => {
        const time = new Date(comment.commentTime);
        // alert(comment.name)
        comment.commentTime = time; // Parse commentTime to a Date object
        console.log(comment.commentTime)
      });

      // Sort comments by date and time
      response.data.sort((a, b) => a.commentTime - b.commentTime);

      if (response.status == 200) {
        setGroup(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDate = (date) => {
    const formattedDate = date.toDateString();
    return (
      <div key={formattedDate} className="comment-date"  style={{textAlign:'center'}}>
        <p>{formattedDate}</p>
      </div>
    );
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
   
    console.log(user.userName);
    
    console.log(comment);
    try {
       const response=await axios.post('http://localhost:8080/api/comment/',comment);
       console.log(response);
       if(response.status==200){
         await fetchComments();
         setComment({name:'', comment:'', commentTime:''});
       }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="comment-section" >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Comments</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <section style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '10px', height: '300px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#ccc #f1f1f1' }}>
        {group.map((comment, index) => (
          <div key={index}>
            {index === 0 || group[index - 1].commentTime.toDateString() !== comment.commentTime.toDateString() ? handleDate(comment.commentTime) : null}
            <div style={{ display: 'flex', justifyContent: comment.userName !== user.userName ? 'flex-start' : 'flex-end' }}>
            
              <div style={{ background: comment.userName !== user.userName ? '#f1f1f1' : '#4D4C7D', padding: '10px', borderRadius: '5px', marginBottom: '10px'}}>
                {comment.userName!==user.userName && (<p style={{color:'darkblue'}}>{comment.userName}</p>)}
                <div style={{ display: 'flex' }}>
                <p style={{ color: comment.userName!==user.userName?'black' :'white'}}>{comment.comment}</p>
                <span style={{ paddingLeft: '5px', fontSize: '14px', color:comment.userName!==user.userName?'black':'white' }}>{comment.commentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="comment-input" style={{ position: 'sticky', bottom: '0', background: '#fff', padding: '10px' }}>
        <form style={{ display: 'flex', justifyContent: 'space-between' }}>
          <input style={{ background: '#F5F7F8' }} onChange={handleComment} value={comment.comment} placeholder='Leave a comment...' />
          <button style={{background:'black', padding:'3px'}} onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;
