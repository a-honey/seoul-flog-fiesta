import { useState } from 'react';
import Api from '../../api';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { openToast, setToastMessage } from '../../features/toastSlice';

const CommentAdd = ({
  id,
  postId,
  isCert,
  setComments,
  isComment,
  setCommentTow,
}) => {
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.post(
        `/comment/${id}${isCert ? '' : '?cert=true'}`,
        { content: data },
      );
      if (res.data === '게시글을 찾을 수 없') {
        alert('잘못된 접근입니다.');
        return;
      }

      setComments((prevComments) => [...prevComments, res.data]);
      setData('');
      dispatch(setToastMessage('댓글이 생성되었습니다.'));
      dispatch(openToast());
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentAddClick = async (e) => {
    e.preventDefault();
    try {
      console.log('대댓글');
      const res = await Api.post(`/comment/${postId}?cert=true`, {
        parentId: id,
        content: data,
      });
      if (res.data === '게시글을 찾을 수 없') {
        alert('잘못된 접근입니다.');
        setCommentTow(false);
        return;
      }
      setComments((prevComments) => [...prevComments, res.data]);
      setData('');
      dispatch(setToastMessage('답글이 생성되었습니다.'));
      dispatch(openToast());
      setCommentTow(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.commentAdd}>
      {postId && <div>ㄴ</div>}
      <input
        placeholder={
          postId
            ? `@${id}님에게 보낼 답글을 입력해주세요.`
            : '댓글을 입력해주세요.'
        }
        type="text"
        value={data}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
      <button
        className="gBtn"
        onClick={isComment ? handleCommentAddClick : handleClick}
      >
        +
      </button>
    </div>
  );
};

export default CommentAdd;
