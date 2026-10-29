import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { ComplaintCategory, ComplaintPriority } from '../../types/complaint';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  MapPin,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Navigation,
  X,
  UploadCloud,
} from 'lucide-react';

export const NewComplaintPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<{ id: string; trackingNumber: string } | null>(null);

  useEffect(() => {
    complaintsService.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategoryId(cats[0].id);
      }
    });
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setAddress(`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)} (Detected Location)`);
        setIsLocating(false);
      },
      (_err) => {
        setIsLocating(false);
        setError('Could not detect location. Please type your street address or landmark manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for the issue.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the problem.');
      return;
    }
    if (!selectedCategoryId) {
      setError('Please select an issue category.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newComplaint = await complaintsService.createComplaint({
        categoryId: selectedCategoryId,
        title: title.trim(),
        description: description.trim(),
        priority,
        address: address.trim() || undefined,
        latitude,
        longitude,
      });

      setCreatedTicket({
        id: newComplaint.id,
        trackingNumber: newComplaint.trackingNumber,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit complaint. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Report a Civic Issue</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Provide accurate details and photos to help municipal authorities triage and resolve the problem rapidly.
        </p>
      </div>

      <Card>
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-700 leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category selection */}
          <div>
            <label className="block text-sm font-semibold text-brandText mb-2">
              Select Issue Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition ${
                    selectedCategoryId === cat.id
                      ? 'border-primary bg-primary-50/70 text-primary font-semibold ring-2 ring-primary/20'
                      : 'border-border-light bg-white text-brandText hover:border-slate-300'
                  }`}
                >
                  <div className="line-clamp-1">{cat.name}</div>
                  <div className="text-[10px] text-brandText-muted mt-0.5">SLA: {cat.slaHours} hrs</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <Input
            label="Issue Summary / Title"
            type="text"
            required
            placeholder="e.g. Hazardous deep pothole on MG Road near Metro Pillar 42"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-brandText mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the severity, exact location landmarks, potential hazards to traffic or pedestrians..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-3.5 py-2.5 text-sm text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-brandText mb-1.5">
              Urgency / Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {(['low', 'medium', 'high', 'urgent'] as ComplaintPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${
                    priority === p
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-brandText-muted border-border-light hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Location & GPS */}
          <div>
            <label className="block text-sm font-semibold text-brandText mb-1.5">
              Location / Landmark
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter street name, colony, landmark or ward..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    prefixIcon={<MapPin className="w-4 h-4 text-brandText-muted" />}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  isLoading={isLocating}
                  className="shrink-0"
                >
                  <Navigation className="w-4 h-4 mr-1 text-primary" /> GPS Location
                </Button>
              </div>
              {latitude && longitude && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coordinates locked: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Photo attachment */}
          <div>
            <label className="block text-sm font-semibold text-brandText mb-1.5">
              Photo Evidence (Recommended)
            </label>
            {filePreview ? (
              <div className="space-y-1">
                <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm">
                  <img src={filePreview} alt="Evidence preview" className="h-44 w-auto object-cover" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedFile && (
                  <p className="text-[11px] font-mono text-brandText-muted">Attached: {selectedFile.name}</p>
                )}
              </div>
            ) : (
              <label className="border-2 border-dashed border-border-light hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 hover:bg-slate-50">
                <UploadCloud className="w-8 h-8 text-primary/80 mb-2" />
                <span className="text-xs font-semibold text-brandText">Click to upload photo evidence</span>
                <span className="text-[11px] text-brandText-muted mt-0.5">JPG, PNG or WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-[11px] text-brandText-muted mt-1.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" /> Photographs are securely stored with DPDP-compliant metadata.
            </p>
          </div>

          <div className="pt-4 border-t border-border-light flex items-center justify-end gap-3">
            <Link to="/citizen/dashboard">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit Ticket <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      {createdTicket && (
        <Modal
          isOpen={true}
          onClose={() => navigate('/citizen/complaints')}
          title="Issue Reported Successfully!"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs text-brandText-muted uppercase tracking-wider font-semibold">
                Your Public Tracking Number
              </p>
              <p className="text-2xl font-mono font-extrabold text-primary mt-1">
                {createdTicket.trackingNumber}
              </p>
            </div>

            <p className="text-xs text-brandText-muted leading-relaxed max-w-sm mx-auto">
              Your grievance has been forwarded to the municipal triage queue. You will receive real-time status updates as field crews inspect and resolve the problem.
            </p>

            <div className="pt-3 flex flex-col gap-2">
              <Link to={`/citizen/complaints?id=${createdTicket.id}`}>
                <Button variant="primary" className="w-full">
                  Track Resolution Progress
                </Button>
              </Link>
              <Link to="/citizen/dashboard">
                <Button variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
