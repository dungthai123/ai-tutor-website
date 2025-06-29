import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary flex items-center justify-center p-2xl-large">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl-large font-bold text-text-primary mb-2xl-large">
          AI English Tutor
        </h1>
        <p className="text-xl-large text-text-secondary mb-3xl-large leading-relaxed">
          Học tiếng Anh thông minh với AI. Luyện tập hội thoại, cải thiện từ vựng 
          và nâng cao kỹ năng giao tiếp một cách hiệu quả.
        </p>
        
        <div className="flex gap-xl-large justify-center">
          <Link href="/aitutor">
            <button className="btn-large">
              Bắt đầu học ngay
            </button>
          </Link>
          <button className="btn-large">
            Tìm hiểu thêm
          </button>
        </div>
        
        <div className="mt-4xl-large grid grid-cols-1 md:grid-cols-3 gap-2xl-large text-left">
          <div className="card">
            <div className="text-3xl-large mb-lg-large">🎯</div>
            <h3 className="text-lg-large font-semibold text-text-primary mb-lg-large">Luyện tập tương tác</h3>
            <p className="text-sm-large text-text-secondary">
              Thực hành hội thoại với AI trong các tình huống thực tế
            </p>
          </div>
          
          <div className="card">
            <div className="text-3xl-large mb-lg-large">📈</div>
            <h3 className="text-lg-large font-semibold text-text-primary mb-lg-large">Theo dõi tiến độ</h3>
            <p className="text-sm-large text-text-secondary">
              Xem chi tiết quá trình học tập và cải thiện của bạn
            </p>
          </div>
          
          <div className="card">
            <div className="text-3xl-large mb-lg-large">⚙️</div>
            <h3 className="text-lg-large font-semibold text-text-primary mb-lg-large">Cá nhân hóa</h3>
            <p className="text-sm-large text-text-secondary">
              Tùy chỉnh trải nghiệm học tập phù hợp với bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
