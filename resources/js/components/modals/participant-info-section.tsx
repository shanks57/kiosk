import { CompanyType } from '@/types';
import axios from 'axios';
import { Check, FileImage, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface ParticipantInfoSectionProps {
    company?: CompanyType | null;
    picName?: string;
    picEmail?: string;
    picPhone?: string;
    userId?: number;
    companyId?: number;
    onUpdate?: () => void;
}

export function ParticipantInfoSection({
    company,
    picName,
    picEmail,
    picPhone,
    userId,
    companyId,
    onUpdate,
}: ParticipantInfoSectionProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({
        name: picName || '',
        email: picEmail || '',
        phone: picPhone || '',
    });

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) return;
        setFile(file);
        setPreview(URL.createObjectURL(file));

        // If company exists, upload immediately and refresh parent
        if (companyId) {
            (async () => {
                try {
                    const fd = new FormData();
                    fd.append('company_logo', file);
                    // show temporary toast
                    toast('Uploading logo...', { duration: 3000 });
                    const res = await axios.post(
                        `/dashboard/companies/${companyId}/logo`,
                        fd,
                        { headers: { 'Content-Type': 'multipart/form-data' } },
                    );
                    toast.success(res.data.message || 'Logo uploaded');
                    setFile(null);
                    setPreview(null);
                    if (onUpdate) onUpdate();
                } catch (err: any) {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message || 'Failed to upload logo',
                    );
                }
            })();
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }

    function removeFile() {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function removeSavedLogo() {
        // If company exists, call API to remove logo
        if (companyId) {
            (async () => {
                try {
                    await axios.delete(
                        `/dashboard/companies/${companyId}/logo`,
                    );
                    toast.success('Company logo removed');
                    if (onUpdate) onUpdate();
                } catch (err: any) {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message || 'Failed to remove logo',
                    );
                }
            })();
        }
    }

    async function handleSave() {
        if (!userId) {
            toast.error('User ID not found');
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('email', editData.email);
            formData.append('phone', editData.phone);

            if (file) {
                formData.append('logo', file);
            }

            const response = await axios.post(
                `/dashboard/users/${userId}/update-profile`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );

            toast.success('Profile updated successfully');
            setIsEditing(false);
            setFile(null);
            setPreview(null);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error: any) {
            const msg =
                error.response?.data?.message || 'Failed to update profile';
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        setIsEditing(false);
        setEditData({
            name: picName || '',
            email: picEmail || '',
            phone: picPhone || '',
        });
        setFile(null);
        setPreview(null);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                {/* {!isEditing && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 size={16} className="mr-1" />
                        Edit
                    </Button>
                )} */}
            </div>

            <div className="flex justify-between text-sm">
                <Label>Company Name</Label>
                <span className="font-medium">{company?.name}</span>
            </div>
            <Separator />

            {/* PIC Name */}
            <div className="flex justify-between text-sm">
                <Label>PIC Name</Label>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                ) : (
                    <span className="font-medium">{picName}</span>
                )}
            </div>
            <Separator />

            {/* PIC Email */}
            <div className="flex justify-between text-sm">
                <Label>PIC Email</Label>
                {isEditing ? (
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                ) : (
                    <span className="font-medium">{picEmail}</span>
                )}
            </div>
            <Separator />

            {/* PIC Phone */}
            <div className="flex justify-between text-sm">
                <Label>PIC Phone Number</Label>
                {isEditing ? (
                    <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                ) : (
                    <span className="font-medium">{picPhone}</span>
                )}
            </div>

            {/* Company Logo */}
            <div className="flex justify-between text-sm">
                <Label>Company Logo</Label>
                <div className="flex w-1/2 flex-col gap-3">
                    {/* Display saved company logo if exists */}
                    {company?.company_logo && !file && (
                        <div className="overflow-hidden rounded-lg border">
                            <div className="flex justify-center bg-gray-100 p-3">
                                <img
                                    src={`/storage/${company.company_logo}`}
                                    alt="Company Logo"
                                    className="h-24 w-24 object-contain"
                                />
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-xs">
                                <p className="font-medium text-gray-600">
                                    Current Logo
                                </p>
                                <button
                                    type="button"
                                    onClick={removeSavedLogo}
                                    className="text-muted-foreground hover:text-red-500"
                                    title="Remove saved logo"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* File preview (new selection) */}
                    {file || preview ? (
                        <div className="overflow-hidden rounded-lg border">
                            <div className="flex justify-center bg-gray-100 p-3">
                                <img
                                    src={preview!}
                                    alt="Preview"
                                    className="h-24 w-24 object-contain"
                                />
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <FileImage
                                        size={14}
                                        className="text-muted-foreground"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {file?.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {(
                                                (file?.size || 0) /
                                                1024 /
                                                1024
                                            ).toFixed(1)}{' '}
                                            MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="text-muted-foreground hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                            className={`flex w-full items-center justify-center gap-2 rounded-xs border bg-gray-50 px-3 py-2 text-xs transition ${
                                dragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200'
                            }`}
                        >
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-1"
                            >
                                <Upload size={14} />
                                Browse
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                or drag
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    e.target.files &&
                                    handleFile(e.target.files[0])
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-1"
                    >
                        <Check size={16} />
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
}
