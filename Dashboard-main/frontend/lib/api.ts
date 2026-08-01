export type Study = {
  id: number;
  titulo: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  empresa: string | null;
  muestra: number | null;
  tecnica: string | null;
  estado: string;
  cuotas_json: Record<string, unknown> | null;
  link_cuestionario: string | null;
  created_at: string | null;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  nombre_completo?: string;
  correo?: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type StudyCreatePayload = {
  titulo: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  empresa?: string;
  muestra?: number;
  tecnica?: string;
  cuotas_json?: Record<string, unknown>;
  link_cuestionario?: string;
};

export type NPSResult = {
  total_validas: number;
  nps_score: number;
  percent_promotores: number;
  percent_detractores: number;
  percent_neutros: number;
};

const BACKEND_ROOT = process.env.NEXT_PUBLIC_BACKEND_ROOT ?? "http://localhost:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `${BACKEND_ROOT}/api/v1`;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Error de API";
    try {
      const data = await response.json();
      message = data?.detail ?? message;
    } catch {
      message = `Error HTTP ${response.status}`;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${BACKEND_ROOT}/health`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo conectar con el backend.");
  }

  return response.json();
}

export async function getStudies(): Promise<Study[]> {
  return requestJson<Study[]>("/studies/");
}

export async function getStudy(studyId: number): Promise<Study> {
  return requestJson<Study>(`/studies/${studyId}`);
}

export async function createStudy(payload: StudyCreatePayload): Promise<Study> {
  return requestJson<Study>("/studies/", {
    method: "POST",
    body: payload,
  });
}

export async function updateStudyState(studyId: number, estado: string): Promise<Study> {
  return requestJson<Study>(`/studies/${studyId}/estado`, {
    method: "PATCH",
    body: { estado },
  });
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  return requestJson<TokenResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await requestJson<unknown>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function calculateNpsFromCsv(file: File, npsColumn = "nps_score"): Promise<NPSResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nps_column", npsColumn);

  const response = await fetch(`${API_URL}/analytics/nps/csv`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "No se pudo analizar el CSV.";
    try {
      const data = await response.json();
      message = data?.detail ?? message;
    } catch {
      message = `Error HTTP ${response.status}`;
    }
    throw new Error(message);
  }

  return response.json();
}
