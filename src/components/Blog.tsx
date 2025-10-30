import React, { useEffect, useState } from 'react';
import { Modal, TitleBar, Button } from "@react95/core";
import { Notepad } from "@react95/icons";
import { useWindowSize } from './WindowSizeProvider';

function Blog(props: {show : boolean, toggle: () => void}) {
    const { isMobile, isTablet } = useWindowSize();
    const showBlog = props.show;
    const toggleBlog = props.toggle;

    const getModalDimensions = () => {
        if (isMobile) {
            return { width: "85vw", height: "50vh" };
        } else if (isTablet) {
            return { width: "80vw", height: "85vh" };
        }
        else {
            return { width: "600px", height: "600px" }; // Increased for better readability
        } 
    };

    const { width, height } = getModalDimensions();
    const [posts, setPosts] = useState<{ 
        title: string; 
        link: string; 
        pubDate: string;
        description: string;
        content: string;
        author: string;
        featuredImage: string;
        category: string;
    }[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [view, setView] = useState<'list' | 'post'>('list');

    useEffect(() => {
        if (!showBlog) return;
        
        setLoading(true);
        setError(null);

        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = 'https://chigox.substack.com/feed';
        
        fetch(proxyUrl + encodeURIComponent(targetUrl))
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                const xmlString = data.contents;
                
                // Create a proper XML parser
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "application/xml");
                
                // Check for parsing errors
                const parserError = xmlDoc.querySelector("parsererror");
                if (parserError) {
                    throw new Error("XML parsing failed");
                }
                
                // Get all item elements
                const items = Array.from(xmlDoc.querySelectorAll("item"));
                console.log('Found items:', items.length);
                
                const posts = items.slice(0, 8).map(item => {
                    // Extract basic fields
                    const title = item.querySelector("title")?.textContent || "Untitled";
                    const description = item.querySelector("description")?.textContent || "";
                    const link = item.querySelector("link")?.textContent || "#";
                    const pubDate = item.querySelector("pubDate")?.textContent || "";
                    const author = item.querySelector("creator")?.textContent || 
                                  item.querySelector("[*|creator]")?.textContent || "DanCE";
                    
                    // Handle content:encoded with namespace
                    let content = "";
                    
                    // Try different ways to get content:encoded
                    const contentNode = item.querySelector("encoded") || 
                                       item.querySelector("[*|encoded]") ||
                                       item.getElementsByTagNameNS("http://purl.org/rss/1.0/modules/content/", "encoded")[0];
                    
                    if (contentNode) {
                        content = contentNode.textContent || "";
                    }
                    
                    // Get featured image from enclosure
                    const enclosure = item.querySelector("enclosure");
                    const featuredImage = enclosure?.getAttribute("url") || "";
                    
                    console.log('Post extracted:', {
                        title: title.substring(0, 50),
                        contentLength: content.length,
                        hasImage: !!featuredImage
                    });
                    
                    return {
                        title,
                        link,
                        pubDate,
                        description,
                        content,
                        author,
                        featuredImage,
                        category: "BLOG"
                    };
                });
                
                setPosts(posts);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError("Failed to load posts. Please try again later.");
                setLoading(false);
            });
    }, [showBlog]);

    const handleCloseBlog = () => {
        setView('list');
        setSelectedPost(null);
        toggleBlog();
    }

    const handlePostClick = (post: any) => {
        setSelectedPost(post);
        setView('post');
    }

    const handleBackToList = () => {
        setView('list');
        setSelectedPost(null);
    }

    const getCategoryColor = (category: string) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        const index = category.length % colors.length;
        return colors[index];
    }

    const screenW = window.innerWidth * 0.06;
    const screenH = -20;

    // Add this function to clean up the HTML content:
    const cleanSubstackContent = (htmlContent: string): string => {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Remove Substack-specific classes and unnecessary wrapper divs
      const unwantedSelectors = [
        '.captioned-image-container',
        '.image-link-expand', 
        '.pencraft',
        '.image2-inset',
        'picture source'
      ];
      
      unwantedSelectors.forEach(selector => {
        tempDiv.querySelectorAll(selector).forEach(el => {
          if (selector === '.captioned-image-container' || selector === '.image2-inset') {
            // Keep the content but remove the wrapper
            while (el.firstChild) {
              el.parentNode?.insertBefore(el.firstChild, el);
            }
          }
          el.remove();
        });
      });
      
      // Clean up image tags - keep only the main img, remove picture/source tags
      tempDiv.querySelectorAll('picture').forEach(picture => {
        const img = picture.querySelector('img');
        if (img && picture.parentNode) {
          picture.parentNode.replaceChild(img, picture);
        }
      });
      
      // Remove all class attributes for cleaner display
      tempDiv.querySelectorAll('*').forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('data-attrs');
        el.removeAttribute('srcset');
        el.removeAttribute('sizes');
        el.removeAttribute('fetchpriority');
      });
      
      return tempDiv.innerHTML;
    };

    return (
        <>
        {showBlog &&
           // @ts-ignore - React95 Modal has incorrect type definitions
          <Modal
            width={width}
            height={height}
            icon={<Notepad variant="32x32_4" />}
            title={view === 'list' ? "My Blog Posts" : selectedPost?.title}
            dragOptions={{
              defaultPosition: { x: screenW, y: screenH }
            }}
            titleBarOptions={[
              <TitleBar.Help
                key="help"
                onClick={() => {
                  alert(view === 'list' ? "My latest Substack posts!" : "Reading blog post")
                }}/>,
              <Modal.Minimize key="minimize" />,
              <TitleBar.Close key="close" onClick={handleCloseBlog} />
            ]}
          >
            {view === 'list' ? (
              // BLOG LIST VIEW
              <main className="blog-container">
                {loading && <p className="loading-message">📚 Loading posts...</p>}
                {error && <p className="error-message">❌ {error}</p>}
                
                {posts.map((post, idx) => (
                  <article 
                    key={idx} 
                    className="blog-post"
                    onClick={() => handlePostClick(post)}
                  >
                    <aside 
                      className="category-badge"
                      style={{
                        background: `linear-gradient(135deg, ${getCategoryColor(post.category)}, ${getCategoryColor(post.category + 'gradient')})`
                      }}
                    >
                      {post.category.substring(0, 8).toUpperCase()}
                    </aside>
                    
                    <section className="post-content">
                      <time className="post-date">
                        📅 {post.pubDate && new Date(post.pubDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                      
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-description">{post.description}</p>
                      <span className="read-more">Read more →</span>
                    </section>
                  </article>
                ))}
                
                {posts.length === 0 && !loading && !error && (
                  <p className="no-posts">📝 No posts found</p>
                )}
              </main>
            ) : (
              // BLOG POST VIEW
              <div className="blog-post-view">
                <div className="blog-post-header">
                  <Button onClick={handleBackToList}>
                    ← Back to Posts
                  </Button>
                  <Button onClick={() => window.open(selectedPost?.link, '_blank')}>
                    Open Original
                  </Button>
                </div>
                
                <div className="blog-post-content">
                  <div className="post-meta">
                    <time>
                      📅 {selectedPost?.pubDate && new Date(selectedPost.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <article 
                    className="post-article"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedPost?.content ? cleanSubstackContent(selectedPost.content) : 'No content available' 
                    }}
                  />
                </div>
              </div>
            )}
          </Modal>
        }
        </>
    )
}

export default Blog;