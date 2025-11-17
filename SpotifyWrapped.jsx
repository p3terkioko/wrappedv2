import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Music, 
  Clock, 
  Users, 
  Mic, 
  Zap, 
  Trophy,
  Calendar,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

// Audio Manager Component
function AudioManager() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio with MP3 file
  useEffect(() => {
    const initializeAudio = () => {
      try {
        // Use absolute path for better deployment compatibility
        audioRef.current = new Audio('/jazz-music-436634.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        audioRef.current.preload = 'auto';
        
        console.log('Audio initialized successfully');
        
        // Try to auto-start music after 3 seconds
        const timer = setTimeout(async () => {
          try {
            await playMusic();
          } catch (error) {
            console.log('Auto-play failed, user interaction required');
          }
        }, 3000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };
    
    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playMusic = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio play failed (may require user interaction):', error);
        // Audio play failed, likely due to browser autoplay policy
        // The user will need to click the play button manually
      }
    }
  };

  const stopMusic = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.volume = newMutedState ? 0 : 0.3;
      setIsMuted(newMutedState);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isPlaying ? stopMusic : playMusic}
        className="text-white/70 hover:text-white transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="text-white/70 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </motion.button>
      
      <motion.div
        animate={{ opacity: isPlaying ? [0.3, 1, 0.3] : 0.3 }}
        transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
        className="flex items-center space-x-1"
      >
        <Music className="w-4 h-4 text-white/70" />
        <span className="text-xs text-white/70">Jazz</span>
      </motion.div>
    </motion.div>
  );
}

// Sound Effects Hook (DISABLED - using only MP3 background music)
function useSoundEffects() {
  // Disable all Web Audio API sounds to use only MP3 jazz music
  const playSlideTransition = () => {}; // No sound
  const playCounterSound = () => {}; // No sound  
  const playRevealSound = () => {}; // No sound

  return {
    playSlideTransition,
    playCounterSound,
    playRevealSound
  };
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-xl mb-8">{this.state.error?.message || 'Unknown error'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import enhanced playlist data
import enhancedPlaylistDataRaw from './enhanced-playlist-data.json';

// Handle the imported data properly
const enhancedPlaylistData = enhancedPlaylistDataRaw.default || enhancedPlaylistDataRaw;

// Debug the imported data
console.log('Imported playlist data:', {
  type: typeof enhancedPlaylistData,
  isArray: Array.isArray(enhancedPlaylistData),
  length: enhancedPlaylistData?.length,
  hasData: !!enhancedPlaylistData,
  firstTrack: enhancedPlaylistData?.[0]
});

// Helper functions for advanced analytics
function getTimeOfDay(dateString) {
  const hour = new Date(dateString).getHours();
  if (hour < 6) return 'Late Night';
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  if (hour < 22) return 'Evening';
  return 'Night';
}

function getDayOfWeek(dateString) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6 ? 'Weekend' : 'Weekday';
}

function getMonth(dateString) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[new Date(dateString).getMonth()];
}

function getReleaseDecade(dateString) {
  if (!dateString) return 'Unknown';
  const year = parseInt(dateString.substring(0, 4));
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

// Custom hook for using enhanced data
function useSpotifyData() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Starting to load enhanced playlist data...');
      console.log('Type of enhancedPlaylistData:', typeof enhancedPlaylistData);
      console.log('Is array:', Array.isArray(enhancedPlaylistData));
      console.log('Length:', enhancedPlaylistData?.length);
      console.log('First item:', enhancedPlaylistData?.[0]);
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Enhanced playlist data loaded:', enhancedPlaylistData?.length || 0, 'tracks');
        if (enhancedPlaylistData && Array.isArray(enhancedPlaylistData)) {
          setTracks(enhancedPlaylistData);
          setLoading(false);
        } else {
          throw new Error('Invalid playlist data format');
        }
      }, 1500);

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (err) {
      console.error('Error loading playlist data:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { tracks, loading, error };
}

// Custom hook for calculating enhanced wrapped metrics
function useWrappedMetrics(tracks) {
  return useMemo(() => {
    console.log('Starting metrics calculation with tracks:', tracks?.length);
    
    // Safety check
    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      console.log('No valid tracks data, returning empty metrics');
      return {
        totalTracks: 0,
        totalMinutes: '0 minutes',
        topContributor: { name: 'No one', count: 0 },
        topArtist: { name: 'No artists', count: 0 },
        firstToParty: null,
        lastMinuteMVP: null,
        timeAnalysis: {},
        genreAnalysis: {},
        popularityAnalysis: {},
        decadeAnalysis: {},
        monthlyBreakdown: { peakMonth: 'Unknown', peakMonthCount: 0, monthCounts: {} }
      };
    }

    // Filter tracks between March 1st and November 30th, 2025
    const startDate = new Date('2025-03-01T00:00:00Z');
    const endDate = new Date('2025-11-30T23:59:59Z');
    
    const filteredTracks = tracks.filter(track => {
      try {
        const addedDate = new Date(track.added_at);
        return addedDate >= startDate && addedDate <= endDate;
      } catch (err) {
        console.warn('Invalid date for track:', track.track?.name);
        return false;
      }
    });

    console.log('Filtered tracks:', filteredTracks.length);

    if (filteredTracks.length === 0) {
      return {
        totalTracks: 0,
        totalMinutes: '0 minutes',
        topContributor: { name: 'No one', count: 0 },
        topArtist: { name: 'No artists', count: 0 },
        firstToParty: null,
        lastMinuteMVP: null,
        timeAnalysis: {},
        genreAnalysis: {},
        popularityAnalysis: {},
        decadeAnalysis: {},
        monthlyBreakdown: { peakMonth: 'Unknown', peakMonthCount: 0, monthCounts: {} }
      };
    }

    // Basic metrics
    const totalTracks = filteredTracks.length;
    const totalMs = filteredTracks.reduce((sum, track) => sum + track.track.duration_ms, 0);
    const totalMinutes = Math.round(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalMinutesFormatted = hours > 0 
      ? `${hours} hours${minutes > 0 ? `, ${minutes} minutes` : ''}`
      : `${minutes} minutes`;

    // Top contributor
    const contributorCounts = {};
    filteredTracks.forEach(track => {
      const contributor = track.added_by.display_name;
      contributorCounts[contributor] = (contributorCounts[contributor] || 0) + 1;
    });
    const topContributor = Object.entries(contributorCounts)
      .reduce((max, [name, count]) => count > max.count ? { name, count } : max, { name: '', count: 0 });

    // Top artist
    const artistCounts = {};
    filteredTracks.forEach(track => {
      track.track.artists.forEach(artist => {
        artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
      });
    });
    const topArtist = Object.entries(artistCounts)
      .reduce((max, [name, count]) => count > max.count ? { name, count } : max, { name: '', count: 0 });

    // First to party & Last minute MVP
    const sortedByDate = [...filteredTracks].sort((a, b) => new Date(a.added_at) - new Date(b.added_at));
    const firstToParty = sortedByDate[0] ? {
      track: sortedByDate[0].track.name,
      user: sortedByDate[0].added_by.display_name,
      artist: sortedByDate[0].track.artists[0].name,
      date: new Date(sortedByDate[0].added_at).toLocaleDateString()
    } : null;

    const lastMinuteMVP = sortedByDate[sortedByDate.length - 1] ? {
      track: sortedByDate[sortedByDate.length - 1].track.name,
      user: sortedByDate[sortedByDate.length - 1].added_by.display_name,
      artist: sortedByDate[sortedByDate.length - 1].track.artists[0].name,
      date: new Date(sortedByDate[sortedByDate.length - 1].added_at).toLocaleDateString()
    } : null;

    // Time analysis
    const timeOfDayCounts = {};
    const dayOfWeekCounts = { Weekend: 0, Weekday: 0 };
    filteredTracks.forEach(track => {
      const timeOfDay = getTimeOfDay(track.added_at);
      const dayType = getDayOfWeek(track.added_at);
      timeOfDayCounts[timeOfDay] = (timeOfDayCounts[timeOfDay] || 0) + 1;
      dayOfWeekCounts[dayType]++;
    });
    
    const peakTime = Object.entries(timeOfDayCounts)
      .reduce((max, [time, count]) => count > max.count ? { time, count } : max, { time: '', count: 0 });
    
    const preferredDays = dayOfWeekCounts.Weekend > dayOfWeekCounts.Weekday ? 'Weekend' : 'Weekday';

    // Monthly breakdown
    const monthCounts = {};
    filteredTracks.forEach(track => {
      const month = getMonth(track.added_at);
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const peakMonth = Object.entries(monthCounts)
      .reduce((max, [month, count]) => count > max.count ? { month, count } : max, { month: '', count: 0 });

    // Genre analysis
    const genreCounts = {};
    let totalGenres = 0;
    filteredTracks.forEach(track => {
      const trackGenres = new Set();
      track.track.artists.forEach(artist => {
        if (artist.genres) {
          artist.genres.forEach(genre => {
            if (!trackGenres.has(genre)) {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
              trackGenres.add(genre);
              totalGenres++;
            }
          });
        }
      });
    });
    
    const topGenre = Object.entries(genreCounts)
      .reduce((max, [genre, count]) => count > max.count ? { genre, count } : max, { genre: 'Unknown', count: 0 });
    
    const uniqueGenres = Object.keys(genreCounts).length;

    // Popularity analysis
    const popularities = filteredTracks
      .map(track => track.track.popularity || 0)
      .filter(p => p > 0);
    
    const avgPopularity = popularities.length > 0 
      ? popularities.reduce((sum, p) => sum + p, 0) / popularities.length 
      : 0;
    
    const undergroundTracks = filteredTracks.filter(track => (track.track.popularity || 0) < 50).length;
    const mainstreamTracks = filteredTracks.filter(track => (track.track.popularity || 0) >= 70).length;

    // Decade analysis
    const decadeCounts = {};
    filteredTracks.forEach(track => {
      const decade = getReleaseDecade(track.track.album?.release_date);
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    });
    
    const topDecade = Object.entries(decadeCounts)
      .reduce((max, [decade, count]) => count > max.count ? { decade, count } : max, { decade: '2020s', count: 0 });

    // Most diverse contributor (by genres)
    const userGenres = {};
    filteredTracks.forEach(track => {
      const user = track.added_by.display_name;
      if (!userGenres[user]) userGenres[user] = new Set();
      track.track.artists.forEach(artist => {
        if (artist.genres) {
          artist.genres.forEach(genre => userGenres[user].add(genre));
        }
      });
    });
    
    const genreMaster = Object.entries(userGenres)
      .map(([user, genres]) => ({ user, count: genres.size }))
      .reduce((max, curr) => curr.count > max.count ? curr : max, { user: '', count: 0 });

    // Music explorer (most underground tracks)
    const userUndergroundCounts = {};
    filteredTracks.forEach(track => {
      const user = track.added_by.display_name;
      const popularity = track.track.popularity || 0;
      if (popularity < 40) {
        userUndergroundCounts[user] = (userUndergroundCounts[user] || 0) + 1;
      }
    });
    
    const musicExplorer = Object.entries(userUndergroundCounts)
      .reduce((max, [user, count]) => count > max.count ? { user, count } : max, { user: '', count: 0 });

    // Calculate first-time contributors (New Voices)
    const userFirstTracks = {};
    const allTracks = enhancedPlaylistDataRaw.default || enhancedPlaylistDataRaw || [];
    
    // Find each user's first track ever
    allTracks.forEach(track => {
      const userId = track.added_by?.id;
      const addedDate = new Date(track.added_at);
      
      if (userId) {
        if (!userFirstTracks[userId] || addedDate < userFirstTracks[userId]) {
          userFirstTracks[userId] = addedDate;
        }
      }
    });
    
    // Find users who added their first track during our period (March-Nov 2025)
    const newVoices = Object.entries(userFirstTracks).filter(([userId, firstDate]) => {
      return firstDate >= startDate && firstDate <= endDate;
    }).map(([userId]) => {
      // Find the user's display name from our filtered tracks
      const userTrack = filteredTracks.find(track => track.added_by?.id === userId);
      return {
        id: userId,
        name: userTrack?.added_by?.display_name || 'Unknown User',
        firstTrackDate: userFirstTracks[userId]
      };
    });

    return {
      totalTracks,
      totalMinutes: totalMinutesFormatted,
      topContributor,
      topArtist,
      firstToParty,
      lastMinuteMVP,
      
      // New analytics
      timeAnalysis: {
        peakTime: peakTime.time,
        peakTimeCount: peakTime.count,
        preferredDays,
        weekendCount: dayOfWeekCounts.Weekend,
        weekdayCount: dayOfWeekCounts.Weekday
      },
      
      genreAnalysis: {
        topGenre: topGenre.genre,
        topGenreCount: topGenre.count,
        uniqueGenres,
        genreMaster: genreMaster.user,
        genreMasterCount: genreMaster.count
      },
      
      popularityAnalysis: {
        avgPopularity: Math.round(avgPopularity),
        undergroundTracks,
        mainstreamTracks,
        musicExplorer: musicExplorer.user,
        explorerCount: musicExplorer.count
      },
      
      decadeAnalysis: {
        topDecade: topDecade.decade,
        topDecadeCount: topDecade.count,
        decadeBreakdown: decadeCounts
      },
      
      monthlyBreakdown: {
        peakMonth: peakMonth.month,
        peakMonthCount: peakMonth.count,
        monthCounts
      },
      
      newVoices
    };
  }, [tracks]);
}

// Loading Component
function LoadingScreen({ error }) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen w-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-8"
        >
          <div className="w-16 h-16 text-red-400 mx-auto mb-4">❌</div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 text-center"
        >
          Oops! Something went wrong
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-red-300 text-center mb-8 max-w-2xl"
        >
          {error}
        </motion.p>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-full text-xl shadow-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-screen bg-gradient-to-br from-black via-purple-900 to-black flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Loader2 className="w-16 h-16 text-green-400" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold text-white mb-4 text-center"
      >
        Fetching Our Data...
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-gray-300 text-center"
      >
        Connecting to Spotify and analyzing our collaborative playlist
      </motion.p>

      <motion.div
        className="mt-8 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Progress Bar Component
function ProgressBar({ currentSlide, totalSlides }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex space-x-2 max-w-md mx-auto">
        {[...Array(totalSlides)].map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: index <= currentSlide ? "100%" : "0%" 
              }}
              transition={{ duration: 0.5, delay: index === currentSlide ? 0.3 : 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Individual Slide Components
function IntroSlide({ onNext }) {
  const [countdown, setCountdown] = useState(3);
  const [showMain, setShowMain] = useState(false);
  const { playSlideTransition } = useSoundEffects();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          setShowMain(true);
          clearInterval(timer);
          playSlideTransition(); // Play sound when revealing main content
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playSlideTransition]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-green-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={showMain ? onNext : undefined}
    >
      {!showMain ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-8xl font-bold text-green-400 mb-4"
          >
            {countdown}
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-2xl text-white"
          >
            Preparing something special...
          </motion.p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Sparkles className="w-20 h-20 text-green-400 mx-auto mb-6" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            Cohort 9 KamiLimu.inthe.Ears
          </motion.h1>
          
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent mb-8"
          >
            WRAPPED
          </motion.h2>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-2xl text-gray-300 mb-12"
          >
            March - November 2025
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex items-center text-gray-400 text-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            <span>Click to begin the journey</span>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function TotalTracksSlide({ totalTracks, onNext }) {
  const [showTeaser, setShowTeaser] = useState(true);
  const [showNumber, setShowNumber] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const { playSlideTransition, playCounterSound, playRevealSound } = useSoundEffects();

  useEffect(() => {
    const teaserTimer = setTimeout(() => {
      setShowTeaser(false);
      playRevealSound(); // Play reveal sound
    }, 2000);
    const numberTimer = setTimeout(() => {
      setShowNumber(true);
    }, 2500);
    
    return () => {
      clearTimeout(teaserTimer);
      clearTimeout(numberTimer);
    };
  }, [playRevealSound]);

  useEffect(() => {
    if (showNumber && totalTracks && totalTracks > 0) {
      const duration = 1500;
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.round(easedProgress * totalTracks);
        setCurrentCount(current);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCurrentCount(totalTracks);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    } else if (showNumber && (!totalTracks || totalTracks === 0)) {
      setCurrentCount(0);
    }
  }, [showNumber, totalTracks]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-green-900 via-black to-blue-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        <Music className="w-24 h-24 text-green-400 mx-auto mb-8" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Together, we added
      </motion.h1>
      
      <AnimatePresence mode="wait">
        {showTeaser && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl text-green-300 mb-8"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              So many incredible tracks... 🎵
            </motion.span>
          </motion.div>
        )}
        
        {!showTeaser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6"
          >
            {showNumber ? currentCount : "???"}
          </motion.div>
        )}
      </AnimatePresence>
      

      
      {!showTeaser && (
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-3xl text-green-300"
        >
          brand new tracks! 🔥
        </motion.p>
      )}
    </motion.div>
  );
}

function TotalTimeSlide({ totalMinutes, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-pink-900 via-black to-purple-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
      >
        <Clock className="w-24 h-24 text-pink-400 mx-auto mb-8" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        That's
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight"
      >
        {totalMinutes}
      </motion.div>
      
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white"
      >
        of pure vibes
      </motion.h2>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-xl text-gray-300 mt-8"
      >
        Time well spent building the perfect playlist!
      </motion.p>
    </motion.div>
  );
}

function TopContributorSlide({ topContributor, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-yellow-900 via-black to-orange-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
        </motion.div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        Our Mix Master
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4"
      >
        {topContributor.name}
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-3xl text-white mb-4"
      >
        with <span className="font-bold text-yellow-400">{topContributor.count}</span> tracks
      </motion.p>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-xl text-gray-300 mt-8"
      >
        The ultimate playlist curator! 🎵
      </motion.p>
    </motion.div>
  );
}

function TopArtistSlide({ topArtist, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.8 }}
      className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-black to-cyan-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.5 }}
        className="mb-8"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Mic className="w-24 h-24 text-cyan-400 mx-auto" />
        </motion.div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        The Playlist's
      </motion.h1>
      
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-8"
      >
        Top Artist
      </motion.h2>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.3 }}
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-6"
      >
        {topArtist.name}
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="text-2xl text-white"
      >
        <span className="font-bold text-cyan-400">{topArtist.count}</span> tracks of pure talent
      </motion.p>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-xl text-gray-300 mt-8"
      >
        Clearly a crowd favorite! 🎤
      </motion.p>
    </motion.div>
  );
}

function NewVoicesSlide({ newVoices, onNext }) {
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReveal(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-teal-900 via-black to-cyan-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-24 h-24 text-teal-400 mx-auto" />
        </motion.div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Fresh Voices
      </motion.h1>
      
      <AnimatePresence mode="wait">
        {!showReveal && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl text-teal-300 mb-8"
          >
            Some special people joined our musical journey... 🌟
          </motion.p>
        )}
        
        {showReveal && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <motion.div
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6"
            >
              {newVoices.length}
            </motion.div>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl md:text-3xl text-teal-300 mb-8"
            >
              {newVoices.length === 1 ? 'person discovered' : 'people discovered'} our playlist for the first time!
            </motion.p>
            
            {newVoices.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-xl text-teal-200 mb-4">Welcome to the family:</p>
                <div className="flex flex-wrap justify-center gap-3 max-h-60 overflow-y-auto">
                  {newVoices.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + (index * 0.05), duration: 0.4 }}
                      className="bg-teal-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-teal-400/30"
                    >
                      <span className="text-white font-medium">{user.name}</span>
                    </motion.div>
                  ))}
                </div>
                {newVoices.length > 15 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    className="text-sm text-teal-300 mt-4"
                  >
                    {newVoices.length} amazing new contributors! 🎉
                  </motion.p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GenreSlide({ genreAnalysis, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, rotateX: -90 }}
      transition={{ duration: 0.8 }}
      className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <Music className="w-24 h-24 text-purple-400 mx-auto" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        Genre Explorer
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
      >
        {genreAnalysis.topGenre}
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-2xl text-white mb-4"
      >
        Our most played genre with <span className="font-bold text-purple-400">{genreAnalysis.topGenreCount}</span> tracks
      </motion.p>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-lg text-gray-300 text-center max-w-2xl"
      >
        <p className="mb-4">🎭 <span className="font-bold">{genreAnalysis.uniqueGenres}</span> unique genres discovered</p>
        {genreAnalysis.genreMaster && (
          <p>🏆 Genre Master: <span className="font-bold text-pink-400">{genreAnalysis.genreMaster}</span> explored <span className="font-bold">{genreAnalysis.genreMasterCount}</span> different genres</p>
        )}
      </motion.div>
    </motion.div>
  );
}

function TimeAnalysisSlide({ timeAnalysis, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-blue-900 via-black to-teal-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <Clock className="w-24 h-24 text-blue-400 mx-auto" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-8"
      >
        Our Music Timing
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
      >
        <div className="bg-gradient-to-br from-blue-800/30 to-teal-800/30 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Peak Time</h3>
          <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {timeAnalysis.peakTime}
          </div>
          <p className="text-teal-300">{timeAnalysis.peakTimeCount} tracks added</p>
        </div>
        
        <div className="bg-gradient-to-br from-teal-800/30 to-blue-800/30 rounded-2xl p-6 border border-teal-400/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-teal-400 mb-4">Preferred Days</h3>
          <div className="text-4xl font-black bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
            {timeAnalysis.preferredDays}
          </div>
          <p className="text-blue-300">
            {timeAnalysis.preferredDays === 'Weekend' 
              ? `${timeAnalysis.weekendCount} weekend tracks` 
              : `${timeAnalysis.weekdayCount} weekday tracks`}
          </p>
        </div>
      </motion.div>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-xl text-gray-300 mt-8"
      >
        We're {timeAnalysis.peakTime.toLowerCase()} music discoverers! 🕐
      </motion.p>
    </motion.div>
  );
}

function PopularitySlide({ popularityAnalysis, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-orange-900 via-black to-red-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <Sparkles className="w-24 h-24 text-orange-400 mx-auto" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        Music Taste Analysis
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6"
      >
        {popularityAnalysis.avgPopularity}%
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-3xl text-white mb-8"
      >
        Average Track Popularity
      </motion.p>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-lg"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{popularityAnalysis.undergroundTracks}</div>
          <p className="text-gray-300">Hidden Gems</p>
          <p className="text-sm text-orange-300">(Under 50% popularity)</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">{popularityAnalysis.mainstreamTracks}</div>
          <p className="text-gray-300">Chart Toppers</p>
          <p className="text-sm text-red-300">(Over 70% popularity)</p>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400 mb-2">🕵️ Music Explorer</div>
          <p className="text-yellow-300 font-semibold">{popularityAnalysis.musicExplorer || 'No one yet!'}</p>
          <p className="text-sm text-yellow-300">({popularityAnalysis.explorerCount} underground finds)</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DecadeSlide({ decadeAnalysis, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.8 }}
      className="h-screen w-screen bg-gradient-to-br from-yellow-900 via-black to-amber-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <Calendar className="w-24 h-24 text-yellow-400 mx-auto" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        Time Machine
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
        className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-6"
      >
        {decadeAnalysis.topDecade}
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-3xl text-white mb-8"
      >
        Our favorite musical era with <span className="font-bold text-yellow-400">{decadeAnalysis.topDecadeCount}</span> tracks
      </motion.p>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-lg text-gray-300 max-w-3xl"
      >
        <p>🎼 Spanning across multiple decades of musical history!</p>
        {Object.keys(decadeAnalysis.decadeBreakdown).length > 1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(decadeAnalysis.decadeBreakdown)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([decade, count]) => (
                <div key={decade} className="bg-yellow-800/20 rounded-lg p-2 border border-yellow-400/30">
                  <div className="font-bold text-yellow-400">{decade}</div>
                  <div className="text-gray-300">{count} tracks</div>
                </div>
              ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function MonthlyTrendsSlide({ monthlyBreakdown, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6 }}
      className="h-screen w-screen bg-gradient-to-br from-green-900 via-black to-emerald-900 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Calendar className="w-24 h-24 text-green-400 mx-auto" />
        </motion.div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Our Peak Music Season
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-6xl md:text-8xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6"
      >
        {monthlyBreakdown.peakMonth}
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-3xl text-white mb-8"
      >
        {monthlyBreakdown.peakMonthCount} tracks added in our busiest month!
      </motion.p>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl"
      >
        {Object.entries(monthlyBreakdown.monthCounts)
          .sort(([a], [b]) => {
            const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
            return months.indexOf(a) - months.indexOf(b);
          })
          .map(([month, count]) => (
            <div key={month} className={`text-center p-3 rounded-lg border ${
              month === monthlyBreakdown.peakMonth 
                ? 'bg-green-800/40 border-green-400/50' 
                : 'bg-emerald-800/20 border-emerald-400/30'
            }`}>
              <div className="font-bold text-green-400">{month}</div>
              <div className="text-2xl font-bold text-white">{count}</div>
            </div>
          ))}
      </motion.div>
    </motion.div>
  );
}

function AwardsSlide({ firstToParty, lastMinuteMVP, metrics, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.8 }}
      className="h-screen w-screen bg-gradient-to-br from-violet-900 via-black to-pink-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
      />
      
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-full blur-xl"
      />
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <Sparkles className="w-20 h-20 text-violet-400 mx-auto mb-6" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-white mb-8"
      >
        That's a Wrap! 🎉
      </motion.h1>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-gradient-to-r from-violet-800/40 to-pink-800/40 backdrop-blur-sm rounded-3xl p-8 border border-violet-400/30 max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {metrics.totalTracks}
            </h3>
            <p className="text-gray-300">New Tracks</p>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {metrics.topContributor.count}
            </h3>
            <p className="text-gray-300">Top Contributions</p>
          </div>
          
          <div className="col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {metrics.totalMinutes}
            </h3>
            <p className="text-gray-300">of Musical Magic</p>
          </div>
        </div>
      </motion.div>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-xl text-gray-300 mt-8 max-w-3xl leading-relaxed"
      >
        Thanks for creating something beautiful together🎵✨
      </motion.p>
      
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-full text-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={() => window.location.reload()}
      >
        Start Over
      </motion.button>
    </motion.div>
  );
}

function FinalSlide({ metrics, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.8 }}
      className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
    >
      {/* Background sparkles */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-32 h-32 text-pink-400 mx-auto" />
        </motion.div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-5xl md:text-7xl font-bold text-white mb-6"
      >
        That's Our 2025 Wrapped!
      </motion.h1>
      
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-2xl md:text-3xl text-pink-300 mb-12 max-w-4xl"
      >
        {metrics.totalTracks} tracks • {metrics.totalMinutes} • {metrics.topArtist.name} was our top artist
      </motion.p>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-center"
      >
        <button
          onClick={() => window.location.reload()}
          className="px-12 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-full text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          🎵 Play Again
        </button>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-white/60 text-lg"
      >
        Press Space or click to continue
      </motion.p>
    </motion.div>
  );
}

// Main App Component with Error Boundary
function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { tracks, loading, error } = useSpotifyData();
  
  // Add error handling for metrics calculation
  let metrics;
  try {
    console.log('Calculating metrics for', tracks?.length || 0, 'tracks');
    metrics = useWrappedMetrics(tracks);
    console.log('Metrics calculated successfully:', metrics);
    console.log('TotalTracks value:', metrics?.totalTracks, 'type:', typeof metrics?.totalTracks);
  } catch (err) {
    console.error('Error calculating metrics:', err);
    return <LoadingScreen error={`Error calculating metrics: ${err.message}`} />;
  }
  
  const slides = [
    { component: IntroSlide, props: {} },
    { component: TotalTracksSlide, props: { totalTracks: metrics.totalTracks } },
    { component: TotalTimeSlide, props: { totalMinutes: metrics.totalMinutes } },
    { component: TopContributorSlide, props: { topContributor: metrics.topContributor } },
    { component: TopArtistSlide, props: { topArtist: metrics.topArtist } },
    { component: NewVoicesSlide, props: { newVoices: metrics.newVoices } },
    { component: GenreSlide, props: { genreAnalysis: metrics.genreAnalysis } },
    { component: TimeAnalysisSlide, props: { timeAnalysis: metrics.timeAnalysis } },
    { component: PopularitySlide, props: { popularityAnalysis: metrics.popularityAnalysis } },
    { component: DecadeSlide, props: { decadeAnalysis: metrics.decadeAnalysis } },
    { component: MonthlyTrendsSlide, props: { monthlyBreakdown: metrics.monthlyBreakdown } },
    { component: AwardsSlide, props: { firstToParty: metrics.firstToParty, lastMinuteMVP: metrics.lastMinuteMVP, metrics: metrics } },
    { component: FinalSlide, props: { metrics } }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentSlide, loading, error]);

  if (loading || error) {
    return <LoadingScreen error={error} />;
  }

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <AudioManager />
      <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
      
      <AnimatePresence mode="wait">
        <CurrentSlideComponent
          key={currentSlide}
          {...slides[currentSlide].props}
          onNext={nextSlide}
        />
      </AnimatePresence>
    </div>
  );
}

// Wrap the app with Error Boundary
function WrappedApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default WrappedApp;