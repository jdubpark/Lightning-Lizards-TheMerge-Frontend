import { useState } from 'react';

export default function TwitterButton() {
    return (
        <div>
            <a
                href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fmergemosaic.xyz%20&text=I%20just%20colored%20my%20first%20pixel%20on%20the%20Merge%20Mosaic.%20%20You%20can%20check%20it%20out%20here%3A%20&hashtags=LGTM"
                className="twitter-share-button"
                data-show-count="false"
            >
                Tweet
            </a>
            <script
                async
                src="https://platform.twitter.com/widgets.js"
            ></script>
        </div>
    );
}