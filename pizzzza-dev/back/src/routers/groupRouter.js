import router from "express";
import authenticateJWT from "../middlewares/authenticateJWT";
import groupController from "../controllers/groupController";
import groupValidate from "../middlewares/validates/groupValidate";
const groupRouter = router();

/** @description 그룹 생성 */
groupRouter.post(
	"/group",
	authenticateJWT,
	groupValidate.validateGroupCreation,
	groupController.createGroup,
);

/** @description 모든 그룹 조회 */
groupRouter.get("/group", groupController.getAllGroups);

/** @description 그룹 가입 신청 */
groupRouter.post(
	"/group/join/:groupid",
	authenticateJWT,
	groupController.requestToJoinGroup,
);

/** @description 그룹 가입 신청 목록 조회 */
groupRouter.get(
	"/group/join",
	authenticateJWT,
	groupController.getGroupJoinRequests,
);

/** @description 그룹 가입 신청 수락 */
groupRouter.post(
	"/group/accept/:groupid/:userid",
	authenticateJWT,
	groupController.acceptRegistration,
);

/** @description 그룹 가입 신청 거절 */
groupRouter.delete(
	"/group/reject/:groupid/:userid",
	authenticateJWT,
	groupController.rejectGroupJoinRequest,
);

/** @description 내가 가입한 그룹 조회 */
groupRouter.get("/group/mygroup", authenticateJWT, groupController.getMyGroups);

/** @description 그룹 상세정보 */
groupRouter.get(
	"/group/:groupid",
	authenticateJWT,
	groupController.getGroupDetails,
);

/** @description 그룹 게시글 작성 */
groupRouter.post(
	"/group/post/:groupid",
	authenticateJWT,
	groupValidate.validateGroupPostCreation,
	groupController.createPost,
);

/** @description 해당 게시글 전체 목록 */
groupRouter.get(
	"/group/posts/:groupid",
	authenticateJWT,
	groupController.getAllPosts,
);

/** @description 해당 게시글 상세정보 */
groupRouter.get(
	"/group/post/:postid",
	authenticateJWT,
	groupController.getPostById,
);

/** @description 내가 속한 그룹 최근 게시글 목록 */
groupRouter.get(
	"/group/recent/posts",
	authenticateJWT,
	groupController.getRecentPosts,
);

/** @description 그룹 게시글 수정 */
groupRouter.put(
	"/group/post/put/:postid",
	groupValidate.validateGroupPostUpdate,
	authenticateJWT,
	groupController.editPost,
);

/** @description 그룹 게시글 삭제 */
groupRouter.delete(
	"/group/post/delete/:postid",
	authenticateJWT,
	groupController.deletePost,
);

/** @description 그룹 탈퇴 */
groupRouter.delete(
	"/group/:groupid",
	authenticateJWT,
	groupController.leaveGroup,
);

/** @description 그룹원 추방 */
groupRouter.delete(
	"/group/expulse/:groupid/:userid",
	authenticateJWT,
	groupController.removeGroupMember,
);

/** @description 그룹 삭제 */
groupRouter.delete(
	"/group/drop/:groupid",
	authenticateJWT,
	groupController.dropGroup,
);

module.exports = groupRouter;
