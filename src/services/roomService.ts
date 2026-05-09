const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveRoom = async (roomData: any): Promise<void> => {
  const isEdit = !!roomData.id;
  const url = isEdit
    ? `${API_BASE_URL}/api/rooms/${roomData.id}`
    : `${API_BASE_URL}/api/rooms`;

  const method = isEdit ? 'PUT' : 'POST';

  console.log('📤 Submitting room data:', roomData);
  console.log('🔗 Request URL:', url);
  console.log('📦 Method:', method);

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData),
  });

  const responseBody = await response.text();
  console.log('📥 Response status:', response.status);
  console.log('📥 Response body:', responseBody);

  if (!response.ok) {
    throw new Error(`Failed to save room. Status: ${response.status}`);
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  if (!confirm('Are you sure you want to delete this room?')) return;

  const url = `${API_BASE_URL}/api/rooms/${roomId}`;
  const response = await fetch(url, { method: 'DELETE' });

  const responseBody = await response.text();
  console.log('🗑️ Delete response status:', response.status);
  console.log('🗑️ Delete response body:', responseBody);

  if (!response.ok) {
    throw new Error(`Failed to delete room. Status: ${response.status}`);
  }
};
