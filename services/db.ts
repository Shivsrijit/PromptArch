
import { supabase } from './supabase';
import { SavedPrompt, PublicPrompt } from "../types";

export const db = {
  async fetchCommunityPrompts(): Promise<PublicPrompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true)
      .order('likes', { ascending: false });

    if (error) {
      console.error('Error fetching community prompts:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      id: item.id.toString(),
      userId: item.user_id,
      sourceImageUrl: item.source_image_url,
      createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
      likes: Number(item.likes || 0)
    }));
  },

  async toggleLikePrompt(id: string, increment: boolean): Promise<number> {
    const { data: existing } = await supabase
      .from('prompts')
      .select('likes')
      .eq('id', id)
      .single();

    const currentLikes = existing?.likes || 0;
    const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    
    const { error } = await supabase
      .from('prompts')
      .update({ likes: newLikes })
      .eq('id', id);
      
    if (error) throw error;
    return newLikes;
  },

  async deletePrompt(id: string, userId: string): Promise<void> {
    // We add user_id to the query to ensure you can only delete your own records
    const { error } = await supabase
      .from('prompts')
      .delete()
      .match({ id: id, user_id: userId });
    
    if (error) throw error;
  },

  async updatePrompt(id: string, updates: Partial<SavedPrompt>, userId: string): Promise<void> {
    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.text) payload.text = updates.text;
    if (updates.attributes) payload.attributes = updates.attributes;

    const { error } = await supabase
      .from('prompts')
      .update(payload)
      .match({ id: id, user_id: userId });
      
    if (error) throw error;
  },

  async publishToCommunity(prompt: Partial<PublicPrompt>, userId: string): Promise<void> {
    const { error } = await supabase.from('prompts').insert({
      user_id: userId,
      name: prompt.name,
      text: prompt.text,
      source_image_url: prompt.sourceImageUrl,
      attributes: prompt.attributes,
      likes: 0,
      is_public: true,
      author: prompt.author
    });
    if (error) throw error;
  },

  async fetchUserLibrary(userId: string): Promise<SavedPrompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user library:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      id: item.id.toString(),
      userId: item.user_id,
      sourceImageUrl: item.source_image_url,
      createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now()
    }));
  },

  async saveToLibrary(prompt: Partial<SavedPrompt>, userId: string): Promise<void> {
    const { error } = await supabase.from('prompts').insert({
      user_id: userId,
      name: prompt.name,
      text: prompt.text,
      source_image_url: prompt.sourceImageUrl,
      attributes: prompt.attributes,
      is_public: false,
      author: 'You'
    });
    if (error) throw error;
  }
};
