export type CoreLayout = "grid" | "compact";

export interface Core {
  id: string;
  name: string;
  tagline: string;
  description: string;
  rules: string[];
  accent_color: string;
  gradient: string;
  layout: CoreLayout;
  icon_name: string;
  created_at?: string;
}

export interface Post {
  id: string;
  core_id: string;
  author_alias: string;
  content: string;
  flames_count: number;
  is_pinned: boolean;
  created_at: string;
}

export interface CommentRow {
  id: string;
  post_id: string;
  author_alias: string;
  content: string;
  created_at: string;
}

export interface LiveDiscussion {
  id: string;
  core_id: string;
  title: string;
  about: string;
  creator_alias: string;
  active_participants: number;
  is_active: boolean;
  created_at: string;
}

export interface LiveMessage {
  id: string;
  discussion_id: string;
  sender_alias: string;
  text: string;
  created_at: string;
}

export interface Profile {
  id: string;
  alias: string;
  reputation: number;
  verified_badge: boolean;
  encryption_level: string;
  created_at: string;
}

export interface AdminSettings {
  id: string;
  master_passkey_hash: string;
  authorized_roster: string[];
}
