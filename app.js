const state = {
  selectedPostId: null,
  posts: [],
  editorAttachments: [],
  settings: {
    title: 'My Cute Blog',
    subtitle: 'A dreamy journal for your posts, images, and memories.',
    bannerImage: '',
    logoImage: '',
    backgroundImage: ''
  }
};

const dom = {
  newPostBtn: document.getElementById('newPostBtn'),
  newPostHeroBtn: document.getElementById('newPostHeroBtn'),
  openCustomizeBtn: document.getElementById('openCustomizeBtn'),
  closeCustomizeBtn: document.getElementById('closeCustomizeBtn'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  heroBanner: document.getElementById('heroBanner'),
  siteTitleInput: document.getElementById('siteTitleInput'),
  siteSubtitleInput: document.getElementById('siteSubtitleInput'),
  postList: document.getElementById('postList'),
  categoryList: document.getElementById('categoryList'),
  postViewPane: document.getElementById('postViewPane'),
  postDisplay: document.getElementById('postDisplay'),
  postTitle: document.getElementById('postTitle'),
  postCategory: document.getElementById('postCategory'),
  postDate: document.getElementById('postDate'),
  postLocation: document.getElementById('postLocation'),
  postTags: document.getElementById('postTags'),
  postContent: document.getElementById('postContent'),
  postAttachments: document.getElementById('postAttachments'),
  commentList: document.getElementById('commentList'),
  commentAuthor: document.getElementById('commentAuthor'),
  commentText: document.getElementById('commentText'),
  postCommentBtn: document.getElementById('postCommentBtn'),
  editorPane: document.getElementById('editorPane'),
  editorTitle: document.getElementById('editorTitle'),
  cancelEditBtn: document.getElementById('cancelEditBtn'),
  savePostBtn: document.getElementById('savePostBtn'),
  postTitleInput: document.getElementById('postTitleInput'),
  postCategoryInput: document.getElementById('postCategoryInput'),
  postDateInput: document.getElementById('postDateInput'),
  postLocationInput: document.getElementById('postLocationInput'),
  postTagsInput: document.getElementById('postTagsInput'),
  postContentEditable: document.getElementById('postContentEditable'),
  editorToolbar: document.getElementById('editorToolbar'),
  fontSelect: document.getElementById('fontSelect'),
  colorSelect: document.getElementById('colorSelect'),
  insertImageBtn: document.getElementById('insertImageBtn'),
  insertVideoBtn: document.getElementById('insertVideoBtn'),
  insertChecklistBtn: document.getElementById('insertChecklistBtn'),
  attachmentInput: document.getElementById('attachmentInput'),
  editorAttachments: document.getElementById('editorAttachments'),
  settingsPane: document.getElementById('settingsPane'),
  bannerInput: document.getElementById('bannerInput'),
  logoInput: document.getElementById('logoInput'),
  backgroundInput: document.getElementById('backgroundInput'),
  siteLogo: document.getElementById('siteLogo'),
  logoFrame: document.getElementById('logoFrame'),
  openCustomize: document.getElementById('openCustomizeBtn'),
  quickNotes: document.getElementById('quickNotes'),
  saveNotesBtn: document.getElementById('saveNotesBtn'),
  editorContextMenu: document.getElementById('editorContextMenu'),
  snackbar: document.getElementById('snackbar'),
  emptyState: document.getElementById('emptyState'),
  editPostBtn: document.getElementById('editPostBtn'),
  deletePostBtn: document.getElementById('deletePostBtn'),
  postViewPaneSection: document.getElementById('postViewPane')
};

const STORAGE_KEYS = {
  posts: 'cuteBlogPosts',
  settings: 'cuteBlogSettings',
  notes: 'cuteBlogQuickNotes'
};

function init() {
  loadState();
  bindEvents();
  render();
}

function loadState() {
  try {
    const savedPosts = localStorage.getItem(STORAGE_KEYS.posts);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
    const savedNotes = localStorage.getItem(STORAGE_KEYS.notes);
    state.posts = savedPosts ? JSON.parse(savedPosts) : [];
    state.settings = savedSettings ? JSON.parse(savedSettings) : state.settings;
    dom.quickNotes.value = savedNotes || '';
  } catch (error) {
    console.error('Unable to load blog data', error);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(state.posts));
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
}

function bindEvents() {
  dom.newPostBtn.addEventListener('click', () => openEditor());
  dom.newPostHeroBtn.addEventListener('click', () => openEditor());
  dom.openCustomizeBtn.addEventListener('click', () => dom.settingsPane.classList.remove('hidden'));
  dom.closeCustomizeBtn.addEventListener('click', () => dom.settingsPane.classList.add('hidden'));
  dom.saveSettingsBtn.addEventListener('click', saveSettings);
  dom.saveNotesBtn.addEventListener('click', saveNotes);
  dom.cancelEditBtn.addEventListener('click', closeEditor);
  dom.savePostBtn.addEventListener('click', savePost);
  dom.postCommentBtn.addEventListener('click', addComment);
  dom.editPostBtn.addEventListener('click', () => openEditor(state.posts.find((p) => p.id === state.selectedPostId)));
  dom.deletePostBtn.addEventListener('click', deleteCurrentPost);

  dom.editorToolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const command = button.dataset.cmd;
    const value = button.dataset.value;
    exec(command, value);
  });

  dom.fontSelect.addEventListener('change', () => {
    exec('fontName', dom.fontSelect.value);
    dom.fontSelect.value = '';
  });
  dom.colorSelect.addEventListener('change', () => {
    exec('foreColor', dom.colorSelect.value);
    dom.colorSelect.value = '';
  });

  dom.insertImageBtn.addEventListener('click', insertImage);
  dom.insertVideoBtn.addEventListener('click', insertVideo);
  dom.insertChecklistBtn.addEventListener('click', insertChecklist);
  dom.attachmentInput.addEventListener('change', handleAttachmentUpload);

  dom.bannerInput.addEventListener('change', (e) => handleImageUpload(e, 'bannerImage'));
  dom.logoInput.addEventListener('change', (e) => handleImageUpload(e, 'logoImage'));
  dom.backgroundInput.addEventListener('change', (e) => handleImageUpload(e, 'backgroundImage'));

  document.addEventListener('click', (event) => {
    if (!dom.editorContextMenu.contains(event.target)) {
      dom.editorContextMenu.classList.add('hidden');
    }
  });

  dom.postContentEditable.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showContextMenu(event);
  });

  dom.editorContextMenu.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const cmd = button.dataset.cmd;
    const value = button.dataset.value;
    exec(cmd, value);
    dom.editorContextMenu.classList.add('hidden');
  });

  dom.siteTitleInput.value = state.settings.title;
  dom.siteSubtitleInput.value = state.settings.subtitle;
}

function render() {
  applyTheme();
  renderPostList();
  renderCategories();
  renderSelectedPost();
  const pageTitle = document.querySelector('h1');
  const pageSubtitle = document.querySelector('.subtitle');
  if (pageTitle) pageTitle.textContent = state.settings.title;
  if (pageSubtitle) pageSubtitle.textContent = state.settings.subtitle;
  dom.siteTitleInput.value = state.settings.title;
  dom.siteSubtitleInput.value = state.settings.subtitle;
  if (state.selectedPostId && !state.posts.find((p) => p.id === state.selectedPostId)) {
    state.selectedPostId = null;
  }
}

function applyTheme() {
  if (state.settings.bannerImage) {
    dom.heroBanner.style.backgroundImage = `url(${state.settings.bannerImage})`;
    dom.heroBanner.style.backgroundSize = 'cover';
    dom.heroBanner.style.backgroundPosition = 'center';
  } else {
    dom.heroBanner.style.backgroundImage = '';
  }
  if (state.settings.backgroundImage) {
    document.body.style.backgroundImage = `url(${state.settings.backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  } else {
    document.body.style.backgroundImage = '';
  }
  if (state.settings.logoImage) {
    dom.siteLogo.src = state.settings.logoImage;
    dom.siteLogo.alt = 'Logo';
    dom.logoFrame.classList.add('has-logo');
    dom.logoFrame.querySelector('.logo-placeholder').style.display = 'none';
  } else {
    dom.siteLogo.src = '';
    dom.logoFrame.classList.remove('has-logo');
    dom.logoFrame.querySelector('.logo-placeholder').style.display = 'block';
  }
}

function renderPostList() {
  dom.postList.innerHTML = '';
  if (state.posts.length === 0) {
    dom.postList.innerHTML = '<p class="muted">No posts yet. Create one to begin your cute blog.</p>';
    return;
  }
  state.posts.slice().reverse().forEach((post) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'post-item' + (post.id === state.selectedPostId ? ' active' : '');
    button.innerHTML = `<h4>${escapeHtml(post.title || 'Untitled post')}</h4><small>${post.date || 'No date'} · ${post.location || 'No location'}</small>`;
    button.addEventListener('click', () => {
      state.selectedPostId = post.id;
      render();
    });
    dom.postList.appendChild(button);
  });
}

function renderCategories() {
  const categories = [...new Set(state.posts.map((post) => post.category).filter(Boolean))];
  dom.categoryList.innerHTML = categories.length
    ? categories.map((category) => `<span>${escapeHtml(category)}</span>`).join('')
    : '<span>No categories yet</span>';
}

function renderSelectedPost() {
  const post = state.posts.find((item) => item.id === state.selectedPostId);
  if (!post) {
    dom.postDisplay.classList.add('hidden');
    dom.emptyState.classList.remove('hidden');
    return;
  }
  dom.postDisplay.classList.remove('hidden');
  dom.emptyState.classList.add('hidden');
  dom.postTitle.textContent = post.title || 'Untitled post';
  dom.postCategory.textContent = post.category || 'General';
  dom.postDate.textContent = post.date || 'No date set';
  dom.postLocation.textContent = post.location || 'No location set';
  dom.postTags.innerHTML = post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  dom.postContent.innerHTML = post.content || '<p><em>Add your first cute entry...</em></p>';
  renderPostAttachments(post);
  renderComments(post);
}

function renderPostAttachments(post) {
  dom.postAttachments.innerHTML = '';
  if (!post.attachments || post.attachments.length === 0) return;
  const list = document.createElement('div');
  list.className = 'attachment-list';
  post.attachments.forEach((file) => {
    const card = document.createElement('div');
    card.className = 'attachment-item';
    card.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br><small>${escapeHtml(file.type)}</small><div class="attachment-actions"><a href="${file.data}" download="${escapeHtml(file.name)}">Download</a></div>`;
    list.appendChild(card);
  });
  dom.postAttachments.appendChild(list);
}

function renderComments(post) {
  dom.commentList.innerHTML = '';
  if (!post.comments || post.comments.length === 0) {
    dom.commentList.innerHTML = '<p class="muted">No comments yet. Be the first to say something nice!</p>';
    return;
  }
  const list = document.createElement('div');
  list.className = 'comment-list';
  post.comments.forEach((comment) => {
    const card = document.createElement('div');
    card.className = 'comment-item';
    card.innerHTML = `<small>${escapeHtml(comment.author || 'Anonymous')} · ${new Date(comment.createdAt).toLocaleString()}</small><div>${escapeHtml(comment.text)}</div>`;
    list.appendChild(card);
  });
  dom.commentList.appendChild(list);
}

function openEditor(post = null) {
  const isEditing = Boolean(post);
  dom.editorTitle.textContent = isEditing ? 'Edit Post' : 'New Post';
  dom.editorPane.classList.remove('hidden');
  dom.postViewPane.classList.add('hidden');
  dom.settingsPane.classList.add('hidden');

  if (isEditing) {
    dom.postTitleInput.value = post.title || '';
    dom.postCategoryInput.value = post.category || '';
    dom.postDateInput.value = post.date || '';
    dom.postLocationInput.value = post.location || '';
    dom.postTagsInput.value = post.tags.join(', ');
    dom.postContentEditable.innerHTML = post.content || '';
    state.editorAttachments = post.attachments || [];
    renderEditorAttachments(state.editorAttachments);
    state.selectedPostId = post.id;
  } else {
    dom.postTitleInput.value = '';
    dom.postCategoryInput.value = '';
    dom.postDateInput.value = new Date().toISOString().slice(0, 10);
    dom.postLocationInput.value = '';
    dom.postTagsInput.value = '';
    dom.postContentEditable.innerHTML = '<p>Write your magical post here...</p>';
    state.editorAttachments = [];
    dom.editorAttachments.innerHTML = '';
    state.selectedPostId = null;
  }
}

function closeEditor() {
  dom.editorPane.classList.add('hidden');
  dom.postViewPane.classList.remove('hidden');
  dom.editorAttachments.innerHTML = '';
}

function savePost() {
  const title = dom.postTitleInput.value.trim();
  const category = dom.postCategoryInput.value.trim();
  const date = dom.postDateInput.value;
  const location = dom.postLocationInput.value.trim();
  const tags = dom.postTagsInput.value.split(',').map((tag) => tag.trim()).filter(Boolean);
  const content = dom.postContentEditable.innerHTML.trim();

  if (!title) {
    showSnackbar('Give your post a title before saving.');
    return;
  }

  const existing = state.posts.find((item) => item.id === state.selectedPostId);
  const postData = {
    id: existing ? existing.id : `post-${Date.now()}`,
    title,
    category,
    date,
    location,
    tags,
    content,
    attachments: state.editorAttachments || [],
    comments: existing ? existing.comments || [] : [],
    updatedAt: new Date().toISOString()
  };

  if (existing) {
    state.posts = state.posts.map((item) => (item.id === existing.id ? postData : item));
  } else {
    state.posts.push(postData);
    state.selectedPostId = postData.id;
  }

  saveState();
  closeEditor();
  render();
  showSnackbar('Post saved! You can add images, videos, tags, and more.');
}

function deleteCurrentPost() {
  if (!state.selectedPostId) return;
  if (!confirm('Delete this post permanently?')) return;
  state.posts = state.posts.filter((post) => post.id !== state.selectedPostId);
  state.selectedPostId = null;
  saveState();
  render();
  showSnackbar('Post deleted.');
}

function addComment() {
  const author = dom.commentAuthor.value.trim() || 'Guest';
  const text = dom.commentText.value.trim();
  if (!text) {
    showSnackbar('Add a comment before posting.');
    return;
  }
  const post = state.posts.find((item) => item.id === state.selectedPostId);
  if (!post) return;
  post.comments = post.comments || [];
  post.comments.push({
    author,
    text,
    createdAt: new Date().toISOString()
  });
  saveState();
  dom.commentText.value = '';
  dom.commentAuthor.value = '';
  renderComments(post);
  showSnackbar('Comment added.');
}

function saveSettings() {
  state.settings.title = dom.siteTitleInput.value.trim() || state.settings.title;
  state.settings.subtitle = dom.siteSubtitleInput.value.trim() || state.settings.subtitle;
  saveState();
  render();
  showSnackbar('Settings saved. Your blog look updated!');
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEYS.notes, dom.quickNotes.value);
  showSnackbar('Quick notes saved locally.');
}

function handleImageUpload(event, key) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.settings[key] = reader.result;
    saveState();
    applyTheme();
    showSnackbar(`${key === 'bannerImage' ? 'Banner' : key === 'logoImage' ? 'Logo' : 'Background'} updated.`);
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function insertImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    insertHtmlAtCursor(`<img src="${src}" alt="Uploaded image" />`);
  });
  input.click();
}

function insertVideo() {
  const url = prompt('Enter a video URL or upload a file');
  if (!url) return;
  if (url.startsWith('http')) {
    insertHtmlAtCursor(`<div class="video-wrapper"><iframe src="${escapeHtml(url)}" frameborder="0" allowfullscreen></iframe></div>`);
    return;
  }
}

function insertChecklist() {
  insertHtmlAtCursor(`<div class="checklist"><label><input type="checkbox" /> Task item</label></div><p></p>`);
}

function handleAttachmentUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const attachment = {
      name: file.name,
      type: file.type || 'attachment',
      data: reader.result
    };
    state.editorAttachments = state.editorAttachments || [];
    state.editorAttachments.push(attachment);

    const post = state.posts.find((item) => item.id === state.selectedPostId);
    if (post) {
      post.attachments = state.editorAttachments;
      saveState();
      renderPostAttachments(post);
      showSnackbar('Attachment added to your post.');
    } else {
      renderEditorAttachments(state.editorAttachments);
      showSnackbar('Attachment saved with your draft.');
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function renderEditorAttachments(attachments) {
  dom.editorAttachments.innerHTML = '';
  if (!attachments || attachments.length === 0) return;
  const list = document.createElement('div');
  list.className = 'attachment-list';
  attachments.forEach((file) => {
    const card = document.createElement('div');
    card.className = 'attachment-item';
    card.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br><small>${escapeHtml(file.type)}</small><div class="attachment-actions"><a href="${file.data}" download="${escapeHtml(file.name)}">Download</a></div>`;
    list.appendChild(card);
  });
  dom.editorAttachments.appendChild(list);
}

function exec(command, value = null) {
  document.execCommand('styleWithCSS', false, true);
  document.execCommand(command, false, value);
  dom.postContentEditable.focus();
}

function insertHtmlAtCursor(html) {
  const sel = window.getSelection();
  if (!sel || !sel.getRangeAt || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const fragment = document.createRange().createContextualFragment(html);
  range.insertNode(fragment);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  dom.postContentEditable.focus();
}

function showContextMenu(event) {
  const menu = dom.editorContextMenu;
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
  menu.classList.remove('hidden');
}

function showSnackbar(message) {
  dom.snackbar.textContent = message;
  dom.snackbar.classList.add('show');
  setTimeout(() => dom.snackbar.classList.remove('show'), 2500);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

init();
