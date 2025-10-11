function commentCompontent(comments){
    return(
        comments.map((comment, index) => (
            <div className='comment-div'>
            <span className='spaced-text' style={{ "color": "blue" }}>{comment.name}</span>
            <span className='spaced-text'>{comment.comment}</span>
            <span className="reaction " >Like</span>
            <span className="reaction " >Reply</span>
            <span className="reaction " >Hide</span>

          {comment.subComments && comment.subComments.length > 0 && (
comment.subComments.map((subComment, subIndex) => (
  <div className='comment-sub-div'>
  <span className='spaced-text' style={{ "color": "blue" }}>{subComment.name}</span>
  <span className='spaced-text'>{subComment.comment}</span>
  <span className="reaction " >Like</span>
  <span className="reaction " >Reply</span>
  <span className="reaction " >Hide</span>
  <hr></hr>
  </div>
  

           
              ))
          )}
          
        </div>
      ))

    )
}
export default commentCompontent;