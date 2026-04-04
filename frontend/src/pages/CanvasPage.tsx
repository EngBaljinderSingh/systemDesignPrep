import DesignCanvas from '../components/DesignCanvas';

export default function CanvasPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex-1">
        <DesignCanvas />
      </div>
    </div>
  );
}
