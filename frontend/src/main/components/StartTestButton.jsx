import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function StartTestButton() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    Swal.fire({
      title: '📝 Test Instructions',
      html: `
        <ul class="text-left list-disc pl-5 space-y-2 text-sm">
          <li>Total Duration: <strong>60 minutes</strong></li>
          <li>Do not refresh or close the tab during the test.</li>
          <li>You can't revisit previous questions once answered.</li>
          <li>Each question carries 1 mark. No negative marking.</li>
          <li>Ensure a stable internet connection.</li>
        </ul>
        <br/>
        <p class="text-red-600 font-semibold">Click "Start Now" to begin in fullscreen mode.</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Start Now',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#1B3C53',
      cancelButtonColor: '#d33',
      width: '42rem',
    }).then((result) => {
      if (result.isConfirmed) {
        // Fullscreen Mode
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }
        // Redirect to test page
        navigate('/tests');
      }
    });
  };

  return (
    <button
      onClick={handleStartTest}
      className="bg-[#1B3C53] text-white px-4 py-2 rounded-lg hover:bg-[#163243] transition"
    >
      Start Test
    </button>
  );
}

export default StartTestButton;
