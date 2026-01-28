
export async function shareContent(type, id, title, subtitle) {
    const url = `${window.location.origin}/?${type}=${id}`;
    const shareData = {
        title: 'HiResAudioStreaming',
        text: `Check out ${title} by ${subtitle} on HiResAudioStreaming!`,
        url: url
    };

    try {
        if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(url);
            if (typeof window.showToast === 'function') {
                window.showToast('Link copied to clipboard', 'success');
            } else {
                alert('Link copied to clipboard');
            }
        }
    } catch (err) {
        console.error('Error sharing:', err);
        if (err.name !== 'AbortError') {
             if (typeof window.showToast === 'function') {
                window.showToast('Failed to share', 'error');
            }
        }
    }
}

window.shareContent = shareContent;
