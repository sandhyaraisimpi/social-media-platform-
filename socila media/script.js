let likeCount = 0;
let followers = [];
let posts = [];
let trendingPosts = [];
let notifications = [];

document.getElementById('post-button').addEventListener('click', createPost);

function createPost() {
    const postContent = document.getElementById('post-content').value;
    const postMedia = document.getElementById('post-media').files[0];
    if (postContent.trim() === '' && !postMedia) return;

    const post = document.createElement('div');
    post.className = 'post';

    const postText = document.createElement('p');
    postText.textContent = postContent;

    if (postMedia) {
        const mediaElement = document.createElement(postMedia.type.startsWith('image') ? 'img' : 'video');
        mediaElement.src = URL.createObjectURL(postMedia);
        if (postMedia.type.startsWith('video')) {
            mediaElement.controls = true;
        }
        mediaElement.onload = () => URL.revokeObjectURL(mediaElement.src); // Free memory
        post.appendChild(mediaElement);
    }

    post.appendChild(postText);

    const postButtons = document.createElement('div');
    postButtons.className = 'post-buttons';

    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', () => {
        likeButton.textContent = `Liked (${++likeCount})`;
        addNotification('Your post received a like!');
    });

    const commentButton = document.createElement('button');
    commentButton.className = 'comment-button';
    commentButton.textContent = 'Comment';
    commentButton.addEventListener('click', () => {
        const commentContent = prompt('Enter your comment:');
        if (commentContent) {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.textContent = commentContent;
            post.appendChild(comment);
            addNotification('Your post received a comment!');
        }
    });

    postButtons.appendChild(likeButton);
    postButtons.appendChild(commentButton);

    post.appendChild(postButtons);

    document.getElementById('posts').appendChild(post);

    posts.push({ content: postContent, likes: 0, media: postMedia });
    updateTrendingContent();

    document.getElementById('post-content').value = '';
    document.getElementById('post-media').value = '';

    addNotification('New post created!');
}

function followUser(userId) {
    if (!followers.includes(userId)) {
        followers.push(userId);
        updateFollowButton(userId, true);
        addNotification(`You followed ${userId}`);
    }
}

function unfollowUser(userId) {
    followers = followers.filter(follower => follower !== userId);
    updateFollowButton(userId, false);
    addNotification(`You unfollowed ${userId}`);
}

function updateFollowButton(userId, isFollowing) {
    const followButton = document.getElementById(`follow-button-${userId}`);
    followButton.textContent = isFollowing ? 'Unfollow' : 'Follow';
    followButton.onclick = isFollowing ? () => unfollowUser(userId) : () => followUser(userId);
}

function addNotification(message) {
    notifications.push(message);
    displayNotifications();
}

function displayNotifications() {
    const notificationArea = document.getElementById('notifications');
    notificationArea.innerHTML = '';
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.textContent = notification;
        notificationArea.appendChild(notificationElement);
    });
}

function likePost(postId) {
    posts[postId].likes++;
    updateTrendingContent();
}

function updateTrendingContent() {
    trendingPosts = posts.sort((a, b) => b.likes - a.likes).slice(0, 5);
    displayTrendingContent();
}

function displayTrendingContent() {
    const trendingArea = document.getElementById('trending');
    trendingArea.innerHTML = '';
    trendingPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'trending-post';
        postElement.textContent = post.content;
        trendingArea.appendChild(postElement);
    });
}
