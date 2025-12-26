import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { staffService } from '../../services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  FileText,
  Building,
} from 'lucide-react';

/* =========================
   ✅ CORRECTED INTERFACE
========================= */
interface StaffMember {
  id: number;
  full_name: string;
  personal_email?: string;
  work_email?: string;
  mobile_number?: string;
  birth_date?: string;
  gender?: string;

  home_address?: string;
  city_name?: string;
  region?: string;
  country_code?: string;
  postal_code?: string;

  job_title?: { title: string } | null;
  division?: { title: string } | null;
  office_location?: { title: string } | null;

  employment_status: string;
  employment_type?: string;
  hire_date?: string;
  base_salary?: number;
  compensation_type?: string;

  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getById(Number(id));
        setStaff(response.data.data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-solarized-green/10 text-solarized-green',
      inactive: 'bg-solarized-base01/10 text-solarized-base01',
      terminated: 'bg-solarized-red/10 text-solarized-red',
      on_leave: 'bg-solarized-yellow/10 text-solarized-yellow',
    };
    return variants[status] || variants.inactive;
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Staff member not found</h2>
        <Button onClick={() => navigate('/staff')} className="mt-4">
          Back to Staff List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-solarized-blue text-white text-xl">
              {getInitials(staff.full_name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold">{staff.full_name}</h1>
            <p className="text-solarized-base01">
              {staff.job_title?.title || 'No job title'}
            </p>
          </div>
        </div>

        <Link to={`/staff/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QUICK INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={staff.work_email || staff.personal_email || 'Not provided'} />
            <InfoRow icon={Phone} label="Phone" value={staff.mobile_number || 'Not provided'} />
            <InfoRow icon={Building} label="Department" value={staff.division?.title || 'Not assigned'} />
            <InfoRow icon={MapPin} label="Location" value={staff.office_location?.title || 'Not assigned'} />

            <Badge className={getStatusBadge(staff.employment_status)}>
              {staff.employment_status.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>

        {/* TABS */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* PERSONAL */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field label="Personal Email" value={staff.personal_email} />
                  <Field label="Date of Birth" value={staff.birth_date} />
                  <Field label="Gender" value={staff.gender} />
                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      value={[
                        staff.home_address,
                        staff.city_name,
                        staff.region,
                        staff.country_code,
                        staff.postal_code,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* EMPLOYMENT */}
            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field label="Job Title" value={staff.job_title?.title} />
                  <Field label="Division" value={staff.division?.title} />
                  <Field label="Office Location" value={staff.office_location?.title} />
                  <Field label="Hire Date" value={staff.hire_date} />
                  <Field label="Employment Type" value={staff.employment_type?.replace('_', ' ')} />
                  <Field label="Compensation Type" value={staff.compensation_type} />
                  <Field label="Base Salary" value={staff.base_salary ? `₹${staff.base_salary}` : 'Not provided'} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* EMERGENCY */}
            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" value={staff.emergency_contact_name} />
                  <Field label="Phone" value={staff.emergency_contact_phone} />
                  <Field label="Relationship" value={staff.emergency_contact_relationship} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* DOCUMENTS */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>No documents uploaded</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 opacity-50" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-solarized-blue" />
      <div>
        <p className="text-sm text-solarized-base01">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-solarized-base01">{label}</p>
      <p className="font-medium">{value || 'Not provided'}</p>
    </div>
  );
}
