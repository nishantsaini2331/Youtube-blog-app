import { createSlice, current } from "@reduxjs/toolkit";

const selectedBlogSlice = createSlice({
  name: "selectedBlogSlice",
  initialState: JSON.parse(localStorage.getItem("selectedBlog")) || {},
  reducers: {
    addSlectedBlog(state, action) {
      localStorage.setItem("selectedBlog", JSON.stringify(action.payload));
      return action.payload;
    },
    removeSelectedBlog(state, action) {
      localStorage.removeItem("selectedBlog");
      return {};
    },

    changeLikes(state, action) {
      if (state.likes.includes(action.payload)) {
        state.likes = state.likes.filter((like) => like !== action.payload);
      } else {
        state.likes = [...state.likes, action.payload];
      }

      return state;
    },

    setComments(state, action) {
      state.comments = [...state.comments, action.payload];
    },

    setCommentLikes(state, action) {
      let { commentId, userId } = action.payload;

      let comment = state.comments.find((comment) => comment._id == commentId);

      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter((like) => like !== userId);
      } else {
        comment.likes = [...comment.likes, userId];
      }

      return state;
    },
    setReplies(state, action) {
      let newReply = action.payload;

      function findParentComment(comments) {
        let parentComment;

        console.log(current(comments));

        for (const comment of comments) {
          console.log(current(comment));
          console.log(1);
          if (comment._id === newReply.parentComment) {
            parentComment = {
              ...comment,
              replies: [...comment.replies, newReply],
            };
            break;
          }

          // for nested replies
          console.log(2);

          if (comment.replies.length > 0) {
            parentComment = findParentComment(comment.replies);
            console.log(3);
            if (parentComment) {
              console.log(4);
              parentComment = {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id == parentComment._id ? parentComment : reply
                ),
              };
              break;
            }
          }
        }

        return parentComment; //top level comment return kr raha hu dost ;
      }

      let parentComment = findParentComment(state.comments);

      state.comments = state.comments.map((comment) =>
        comment._id == parentComment._id ? parentComment : comment
      );
    },
  },
});

export const {
  addSlectedBlog,
  removeSelectedBlog,
  changeLikes,
  setComments,
  setCommentLikes,
  setReplies,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
