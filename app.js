// Câu 2: viết JavaScript tại đây

// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const statusEl = document.querySelector('#status');
const eventList = document.querySelector('#event-list');

// Câu 2a: "Còn 12/40 chỗ" hoặc "Hết chỗ" khi đã đủ
const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  return remaining > 0
    ? `Còn ${remaining}/${event.capacity} chỗ`
    : 'Hết chỗ';
};

// Câu 2b: tạo 1 card từ dữ liệu sự kiện (không dùng innerHTML)
const createEventCard = (event) => {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.setAttribute('src', 'img/event.svg');
  img.setAttribute('alt', `Ảnh minh hoạ ${event.name}`);
  img.setAttribute('width', '320');
  img.setAttribute('height', '180');

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h2');
  title.className = 'card-title';
  const link = document.createElement('a');
  link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
  link.textContent = event.name;
  title.append(link);

  const timeP = document.createElement('p');
  timeP.className = 'card-time';
  const time = document.createElement('time');
  time.setAttribute('datetime', event.startTime);
  time.textContent = formatDateTime(event.startTime);
  timeP.append(time);

  const locationP = document.createElement('p');
  locationP.className = 'card-location';
  locationP.textContent = event.location;

  const seatsP = document.createElement('p');
  seatsP.className = 'card-seats';
  const seatsText = formatSeats(event);
  if (seatsText === 'Hết chỗ') {
    const badge = document.createElement('span');
    badge.className = 'badge badge-full';
    badge.textContent = seatsText;
    seatsP.append(badge);
  } else {
    seatsP.textContent = seatsText;
  }

  body.append(title, timeP, locationP, seatsP);
  card.append(img, body);
  return card;
};

const renderEvents = (events) => {
  const cards = events.map(createEventCard);
  eventList.replaceChildren(...cards);
};

// Câu 2c: tải dữ liệu từ API
const loadEvents = async (keyword = '') => {
  statusEl.textContent = 'Đang tải…';

  const params = new URLSearchParams({ pageSize: '50' });
  if (keyword) {
    params.set('q', keyword);
  }

  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const events = data.items;

    renderEvents(events);
    statusEl.textContent = events.length > 0
      ? `Tìm thấy ${data.totalCount} sự kiện`
      : 'Không có sự kiện nào khớp từ khoá.';
  } catch (error) {
    eventList.replaceChildren();
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});

loadEvents();