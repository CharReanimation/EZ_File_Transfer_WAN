document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const fileList = document.getElementById('fileList');

  // Upload
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      alert('Upload Success!');
      loadFiles();
    } catch (err) {
      alert('Upload Failed!');
      console.error(err);
    }
  });

  // Load File List
  async function loadFiles() {
    try {
      const res = await fetch('/files');
      const files = await res.json();
      fileList.innerHTML = '';
      files.forEach(file => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/download/${file}`;
        link.textContent = file;
        li.appendChild(link);
        fileList.appendChild(li);
      });
    } catch (err) {
      fileList.innerHTML = '<li>Cannot Load File List</li>';
      console.error(err);
    }
  }

  loadFiles();
});
