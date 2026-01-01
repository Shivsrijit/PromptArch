import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppMode, SavedPrompt, PublicPrompt, ImageAdjustments, ChatMessage } from './types';
import { reverseEngineerPrompt, generateHighResImage, editWithPrompt, chatEditImage } from './services/gemini';
import { db } from './services/db';
import { supabase } from './services/supabase';
import { User } from '@supabase/supabase-js';

//Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SectionHeading } from './components/SectionHeading';
import { SaveModal } from './components/SaveModal';
import { AestheticCard } from './components/AestheticCard';
import { HomeHero } from './components/HomeHero';
import { AuthModal } from './components/AuthModal';

//Features Sections
import { ReverseEngineerSection } from './components/ReverseEngineerSection';
import { RemixSection } from './components/RemixSection';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [dynamicAttributes, setDynamicAttributes] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [userTargetImage, setUserTargetImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [communityPrompts, setCommunityPrompts] = useState<PublicPrompt[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  
  const [resolution, setResolution] = useState<"1K" | "2K" | "4K">("1K");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tempSaveName, setTempSaveName] = useState("");

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({ 
    brightness: 100, contrast: 100, rotation: 0, scale: 1, offsetX: 0, offsetY: 0
  });
  
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) refreshData(session.user.id);
      else refreshData();
    };

    checkUser();

    const storedLikes = localStorage.getItem('liked_prompts');
    if (storedLikes) {
      try {
        setLikedIds(JSON.parse(storedLikes));
      } catch (e) {
        setLikedIds([]);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthOpen(false);
        refreshData(session.user.id);
      } else {
        setSavedPrompts([]);
        refreshData();
      }
    });

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light');
    }

    return () => subscription.unsubscribe();
  }, []);

  const refreshData = async (userId?: string) => {
    const community = await db.fetchCommunityPrompts();
    setCommunityPrompts(community);
    
    if (userId) {
      const library = await db.fetchUserLibrary(userId);
      setSavedPrompts(library);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMode(AppMode.HOME);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (!newTheme) {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
    );
  };

  const saveToLibrary = async (makePublic: boolean = false) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!tempSaveName.trim()) return;
    
    setLoading(true);
    setLoadingMsg("Archiving DNA...");
    
    try {
      const imageToSave = generatedImage || sourceImage || null;
      const basePrompt = {
        name: tempSaveName,
        text: currentPrompt,
        attributes: selectedAttributes.length > 0 ? selectedAttributes : dynamicAttributes,
        sourceImageUrl: imageToSave as string
      };

      if (makePublic) {
        await db.publishToCommunity({ 
          ...basePrompt, 
          id: '', 
          likes: 0, 
          author: user.user_metadata.full_name || user.email?.split('@')[0] || "Architect",
          createdAt: Date.now()
        } as PublicPrompt, user.id);
      } else {
        await db.saveToLibrary(basePrompt, user.id);
      }

      await refreshData(user.id);
      setIsSaving(false);
      setTempSaveName("");
      if (makePublic) setMode(AppMode.TRENDING_FEED);
    } catch (error) {
      alert("Failed to save to cloud.");
    } finally {
      setLoading(false);
    }
  };

  const likePrompt = async (id: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    const isCurrentlyLiked = likedIds.includes(id);
    const increment = !isCurrentlyLiked;
    
    // Optimistic UI Update
    setCommunityPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, likes: increment ? p.likes + 1 : Math.max(0, p.likes - 1) } : p
    ));

    const newLikedIds = increment 
      ? [...likedIds, id] 
      : likedIds.filter(lid => lid !== id);
    
    setLikedIds(newLikedIds);
    localStorage.setItem('liked_prompts', JSON.stringify(newLikedIds));

    try {
      await db.toggleLikePrompt(id, increment);
    } catch (e) {
      // Rollback local state on error
      setLikedIds(likedIds);
      localStorage.setItem('liked_prompts', JSON.stringify(likedIds));
      refreshData(user.id);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this aesthetic?")) return;
    
    setLoading(true);
    setLoadingMsg("Deleting from cloud...");
    try {
      await db.deletePrompt(id, user.id);
      await refreshData(user.id);
    } catch (e) {
      alert("Delete failed. You may not have permission to delete this.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = async (id: string, currentName: string) => {
    if (!user) return;
    const newName = prompt("Enter a new name for this creation:", currentName);
    if (!newName || newName === currentName) return;
    
    setLoading(true);
    setLoadingMsg("Updating archive...");
    try {
      await db.updatePrompt(id, { name: newName } as any, user.id);
      await refreshData(user.id);
    } catch (e) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const trendingSortedPrompts = useMemo(() => {
    return [...communityPrompts].sort((a, b) => Number(b.likes) - Number(a.likes));
  }, [communityPrompts]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'source' | 'target') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const b64 = event.target?.result as string;
      if (type === 'source') {
        setSourceImage(b64);
        setLoading(true);
        setLoadingMsg("Deconstructing Visual DNA");
        try {
          const result = await reverseEngineerPrompt(b64);
          setCurrentPrompt(result.prompt);
          setDynamicAttributes(result.attributes);
          setSelectedAttributes(result.attributes);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      } else {
        setUserTargetImage(b64);
        setGeneratedImage(null);
        setAdjustments({ 
          brightness: 100, contrast: 100, rotation: 0, scale: 1, offsetX: 0, offsetY: 0
        });
        setChatMessages([{ role: 'model', text: 'Identity anchored. Apply your style DNA to start the remix.' }]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateHighRes = async () => {
    if (!currentPrompt) return;
    setLoading(true);
    setLoadingMsg("Synthesizing Masterpiece...");
    try {
      const img = await generateHighResImage(currentPrompt, resolution);
      if (img) setGeneratedImage(img);
    } catch (err) { alert("Generation error."); }
    finally { setLoading(false); }
  };

  const handleApplyStyle = async () => {
    if (!userTargetImage || !currentPrompt) return;
    setLoading(true);
    setLoadingMsg("Subject-Locked Style Transfer...");
    try {
      const img = await editWithPrompt(userTargetImage, currentPrompt, selectedAttributes);
      if (img) setGeneratedImage(img);
    } catch (err) { alert("Style transfer failed."); }
    finally { setLoading(false); }
  };

  const handleAIChatEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || (!userTargetImage && !generatedImage)) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setLoadingMsg("Refining Details...");
    try {
      const targetBase = generatedImage || userTargetImage;
      const img = await chatEditImage(targetBase!, userMsg);
      if (img) {
        setGeneratedImage(img);
        setChatMessages(prev => [...prev, { role: 'model', text: "Modification complete." }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Cycle limit reached." }]);
    } finally { setLoading(false); }
  };

  const downloadImage = () => {
    const img = generatedImage || userTargetImage;
    if (!img) return;
    const link = document.createElement('a');
    link.href = img;
    link.download = `PromptArchitect-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col hero-gradient overflow-x-hidden">
      {loading && <LoadingOverlay message={loadingMsg} />}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SaveModal isOpen={isSaving} onClose={() => setIsSaving(false)} tempName={tempSaveName} setTempName={setTempSaveName} onSave={saveToLibrary} />
      <Navbar 
        mode={mode} setMode={setMode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} 
        user={user} onOpenAuth={() => setIsAuthOpen(true)} onSignOut={handleSignOut}
      />

      <main className="pt-24 md:pt-32 pb-44 md:pb-12 flex-1 px-6 md:px-12 max-w-7xl mx-auto w-full box-border">
        {mode === AppMode.HOME && <HomeHero setMode={setMode} />}

        {mode === AppMode.TRENDING_FEED && (
          <div className="animate-in fade-in duration-700 w-full">
            <SectionHeading title="Community Canvas" subtitle="Global gallery of visual deconstructions." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingSortedPrompts.map((p) => (
                <AestheticCard 
                  key={p.id} prompt={p} onLike={() => likePrompt(p.id)}
                  isLiked={likedIds.includes(p.id)}
                  currentUserId={user?.id}
                  onDelete={() => handleDeletePrompt(p.id)}
                  onEdit={() => handleEditPrompt(p.id, p.name)}
                  onAdopt={() => {
                    setCurrentPrompt(p.text); setDynamicAttributes(p.attributes || []); setSelectedAttributes(p.attributes || []);
                    setSourceImage(p.sourceImageUrl || null); setMode(AppMode.STYLE_TRANSFER);
                  }}
                />
              ))}
              {trendingSortedPrompts.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-40 italic serif text-xl">The feed is currently quiet. Be the first to publish.</div>
              )}
            </div>
          </div>
        )}

        {mode === AppMode.REVERSE_ENGINEER && (
          <ReverseEngineerSection 
            sourceImage={sourceImage} onUpload={(e) => handleImageUpload(e, 'source')} 
            currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} 
            onPublish={() => {
              if (!user) setIsAuthOpen(true);
              else setIsSaving(true);
            }} 
            onNavigateToRemix={() => setMode(AppMode.STYLE_TRANSFER)}
          />
        )}

        {mode === AppMode.IMAGE_GEN && (
          <div className="animate-in fade-in duration-700 w-full">
            <SectionHeading title="Construct" subtitle="Materialize worlds from pure data." />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="glass-panel p-8 rounded-[40px] space-y-8 w-full">
                <textarea value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} placeholder="Visual coordinates..." className="w-full h-40 bg-transparent text-xl serif italic resize-none focus:outline-none text-inherit" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['1K', '2K', '4K'] as const).map(s => (
                      <button key={s} onClick={() => setResolution(s)} className={`w-10 h-10 rounded-full text-[10px] font-bold border ${resolution === s ? 'btn-primary' : 'border-zinc-500/20 text-zinc-500'}`}>{s}</button>
                    ))}
                  </div>
                  <button onClick={handleGenerateHighRes} className="btn-primary px-8 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold">Synthesize</button>
                </div>
                {generatedImage && <button onClick={() => {
                  if (!user) setIsAuthOpen(true);
                  else setIsSaving(true);
                }} className="w-full py-4 border border-zinc-500/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-inherit">Publish Result</button>}
              </div>
              <div className="aspect-square relative group w-full">
                {generatedImage ? (
                  <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl relative bg-black">
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Gen" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                      <button onClick={downloadImage} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl">↓</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-[40px] border-2 border-dashed border-zinc-500/20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 rounded-full btn-primary flex items-center justify-center text-3xl font-bold serif italic">M</div>
                    <span className="serif italic text-zinc-500 text-xl tracking-tight opacity-40">Materialize Vision</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mode === AppMode.STYLE_TRANSFER && (
          <RemixSection 
            dynamicAttributes={dynamicAttributes} selectedAttributes={selectedAttributes} toggleAttribute={toggleAttribute}
            userTargetImage={userTargetImage} generatedImage={generatedImage} adjustments={adjustments} onAdjustmentsChange={setAdjustments}
            onTargetUpload={(e) => handleImageUpload(e, 'target')} onApplyStyle={handleApplyStyle} onPublish={() => {
               if (!user) setIsAuthOpen(true);
               else setIsSaving(true);
            }}
            chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} onChatSubmit={handleAIChatEdit}
            chatScrollRef={chatScrollRef} downloadImage={downloadImage}
          />
        )}

        {mode === AppMode.MY_LIBRARY && (
          <div className="animate-in fade-in duration-700 w-full">
            <SectionHeading title="Private Archive" subtitle="Your local vault of visual DNA." />
            {!user ? (
               <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-[40px] border-dashed border-2 border-zinc-500/20">
                  <p className="serif italic text-2xl text-zinc-500 mb-8">Sign in to unlock your persistent library.</p>
                  <button onClick={() => setIsAuthOpen(true)} className="btn-primary px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl">Connect Account</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPrompts.map((p) => (
                  <AestheticCard 
                    key={p.id} prompt={{...p, author: 'You', likes: 0} as PublicPrompt} isLibrary
                    currentUserId={user?.id}
                    onDelete={() => handleDeletePrompt(p.id)}
                    onEdit={() => handleEditPrompt(p.id, p.name)}
                    onAdopt={() => { setCurrentPrompt(p.text); setDynamicAttributes(p.attributes || []); setMode(AppMode.STYLE_TRANSFER); }}
                  />
                ))}
                {savedPrompts.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-40 italic serif text-xl">Your archive is empty. Start by deconstructing an image.</div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
