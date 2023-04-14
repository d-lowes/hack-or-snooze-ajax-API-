'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let isFill = isFavorite(story) ? '-fill' : '';

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="star-favorite bi bi-star${isFill}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



/** Get the submit story form data and put it on the page. */

async function putNewStoryOnPage(evt) {
  evt.preventDefault();

  // console.log(
  //   'title',
  //   $('#story-title').val(),
  //   'author',
  //   $('#story-author').val(),
  //   'url',
  //   $('#story-URL').val()
  // );

  // TODO: Check URL, must be HTTP://
  const newStory = await storyList.addStory(currentUser, {
    title: $('#story-title').val(),
    author: $('#story-author').val(),
    url: $('#story-URL').val(),
  });

  const newStoryMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend(newStoryMarkup);
}

$newStoryForm.on('submit', putNewStoryOnPage);

/** Listen for the star click, and add the article to the favorites list or
 *  remove if the star is already filled and a favorite.
 */
// TODO: use jquery
// TODO: get the closest list id, and find the story from that ID
  // pass that into isFavorite
  // select id string "", pass that into a function that retrieves the entire
  // story from the API
async function addOrRemoveFavorite(evt) {
  let $starListId = $(evt.target).closest("li").attr('id');
  console.log("starlist id", $starListId);
  let storyTarget = getEntireStory($starListId);

  if (isFavorite()) {
    await currentUser.addFavorite()
    evt.target.classlist.toggle('bs-star-fill');
  } else {
    await currentUser.removeFavorite();
    evt.target.classlist.toggle('bs-star');
  }
}



$allStoriesList.on('click', ".star", addOrRemoveFavorite);

function isFavorite(story) {
  return currentUser.favorites.some(
    (favStory) => favStory.storyId === story.storyId
  );
}
