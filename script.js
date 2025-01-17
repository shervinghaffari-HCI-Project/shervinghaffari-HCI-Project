document.addEventListener('DOMContentLoaded', () => {
    // Define the candidates array with necessary details
    const candidates = [
        { id: 1, image: "", name: "John Doe", party: "Independent", bio: "Experienced community leader with a focus on education and healthcare." },
        { id: 2, image: "", name: "Jane Smith", party: "Democratic", bio: "Passionate advocate for environmental sustainability and economic reform." },
        { id: 3, image: "", name: "Robert Brown", party: "Republican", bio: "Veteran politician committed to national security and fiscal responsibility." },
        { id: 4, image: "", name: "Emily Davis", party: "Green", bio: "Environmental activist dedicated to combating climate change and promoting renewable energy." },
        { id: 5, image: "", name: "Michael Wilson", party: "Democratic", bio: "Focused on improving healthcare access and education for all citizens." },
        { id: 6, image: "", name: "Sarah Johnson", party: "Republican", bio: "Committed to strengthening the economy and enhancing national security." },
        { id: 7, image: "", name: "David Lee", party: "Independent", bio: "Community organizer with a passion for social justice and equality." },
        { id: 8, image: "", name: "Laura Martinez", party: "Green", bio: "Advocate for sustainable agriculture and green infrastructure development." },
        { id: 9, image: "", name: "James Anderson", party: "Democratic", bio: "Dedicated to expanding affordable housing and improving public transportation." },
        { id: 10, image: "", name: "Linda Thompson", party: "Republican", bio: "Focused on tax reform and reducing government bureaucracy." },
        { id: 11, image: "", name: "William Garcia", party: "Independent", bio: "Passionate about education reform and empowering local communities." },
        { id: 12, image: "", name: "Barbara Martinez", party: "Green", bio: "Environmental lawyer advocating for stricter pollution controls and conservation efforts." },
        { id: 13, image: "", name: "Richard Hernandez", party: "Democratic", bio: "Committed to healthcare reform and workers' rights." },
        { id: 14, image: "", name: "Susan Clark", party: "Republican", bio: "Focused on military expansion and economic growth." },
        { id: 15, image: "", name: "Charles Lewis", party: "Independent", bio: "Entrepreneur advocating for small businesses and innovation." },
        { id: 16, image: "", name: "Jessica Walker", party: "Green", bio: "Promotes renewable energy initiatives and sustainable urban planning." },
        { id: 17, image: "", name: "Thomas Hall", party: "Democratic", bio: "Dedicated to civil rights and expanding access to education." },
        { id: 18, image: "", name: "Karen Allen", party: "Republican", bio: "Committed to lowering taxes and strengthening law enforcement." },
        { id: 19, image: "", name: "Christopher Young", party: "Independent", bio: "Focused on transparency in government and anti-corruption measures." },
        { id: 20, image: "", name: "Patricia King", party: "Green", bio: "Advocates for biodiversity conservation and eco-friendly policies." },
        { id: 21, image: "", name: "Daniel Wright", party: "Democratic", bio: "Committed to expanding healthcare coverage and social welfare programs." },
        { id: 22, image: "", name: "Nancy Scott", party: "Republican", bio: "Focused on reducing government spending and promoting free-market policies." },
        { id: 23, image: "", name: "Mark Green", party: "Independent", bio: "Community advocate focused on housing and urban development." },
        { id: 24, image: "", name: "Lisa Adams", party: "Green", bio: "Promotes sustainable transportation and green public spaces." },
        { id: 25, image: "", name: "Steven Baker", party: "Democratic", bio: "Dedicated to labor rights and environmental justice." },
        { id: 26, image: "", name: "Michelle Gonzalez", party: "Republican", bio: "Focused on border security and economic liberalization." },
        { id: 27, image: "", name: "Paul Nelson", party: "Independent", bio: "Advocate for digital privacy and technological innovation." },
        { id: 28, image: "", name: "Laura Carter", party: "Green", bio: "Promotes water conservation and renewable resource management." },
        { id: 29, image: "", name: "George Mitchell", party: "Democratic", bio: "Committed to public education and affordable housing initiatives." },
        { id: 30, image: "", name: "Sandra Perez", party: "Republican", bio: "Focused on economic policies and strengthening the military." },
    ];
    
    // DOM Elements
    const candidatesContainer = document.getElementById('candidatesContainer');
    const searchBar = document.getElementById('searchBar');
    const submitVoteButton = document.getElementById('submitVote');
    const selectedCountSpan = document.getElementById('selectedCount');
    const confirmationModal = document.getElementById('confirmationModal');
    const successModal = document.getElementById('successModal');
    const voterForm = document.getElementById('voterForm');
    const selectAllButton = document.getElementById('selectAll');
    const deselectAllButton = document.getElementById('deselectAll');
    const detailsModal = document.getElementById('detailsModal');
    const detailsContent = document.getElementById('detailsContent');
    
    // Set to keep track of selected candidates
    let selectedCandidates = new Set();
    const MAX_SELECTION = 30;
    
    /**
     * Fetch candidate images from Random User API
     */
    async function fetchCandidateImages() {
        try {
            const response = await fetch('https://randomuser.me/api/?results=30&inc=name,picture&nat=us,gb,ca,au,ie,nz&noinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            data.results.forEach((user, index) => {
                if (candidates[index]) {
                    candidates[index].image = user.picture.large;
                }
            });
            displayCandidates(candidates);
            console.log('Candidates loaded:', candidates);
        } catch (error) {
            console.error('Error fetching candidate images:', error);
            // Assign a default image in case of error
            candidates.forEach(candidate => {
                if (!candidate.image) {
                    candidate.image = 'https://via.placeholder.com/150?text=No+Image';
                }
            });
            displayCandidates(candidates);
            console.log('Candidates loaded with default images:', candidates);
        }
    }
    
    /**
     * Display candidates in the DOM
     * @param {Array} filteredCandidates - Array of candidate objects to display
     */
    function displayCandidates(filteredCandidates) {
        candidatesContainer.innerHTML = '';
        if (filteredCandidates.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = "No candidates found.";
            noResults.style.gridColumn = "1 / -1";
            noResults.style.fontSize = "1.2em";
            noResults.style.color = "#666";
            candidatesContainer.appendChild(noResults);
            return;
        }
    
        filteredCandidates.forEach(candidate => {
            const card = document.createElement('div');
            card.classList.add('candidate-card');
            card.setAttribute('tabindex', '0'); // Make the card focusable for accessibility
    
            card.innerHTML = `
                <img src="${candidate.image}" alt="${candidate.name}" loading="lazy">
                <h3>${candidate.name}</h3>
                <input type="checkbox" class="vote-checkbox" data-id="${candidate.id}" ${selectedCandidates.has(candidate.id) ? 'checked' : ''} aria-label="Select ${candidate.name}">
            `;
    
            // Event listener to open details modal when card is clicked (excluding checkbox)
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('vote-checkbox')) return; // Ignore checkbox clicks
                openDetailsModal(candidate);
            });
    
            // Allow opening modal via keyboard (Enter or Space)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetailsModal(candidate);
                }
            });
    
            candidatesContainer.appendChild(card);
        });
    
        updateCheckboxState();
    }
    
    /**
     * Debounce function to limit the rate at which a function can fire.
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     */
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }
    
    /**
     * Search functionality with debounce
     */
    searchBar.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = candidates.filter(candidate => candidate.name.toLowerCase().includes(searchTerm));
        displayCandidates(filtered);
    }, 300)); // 300ms debounce delay
    
    /**
     * Handle vote selection using event delegation
     */
    candidatesContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('vote-checkbox')) {
            const candidateId = parseInt(e.target.getAttribute('data-id'));
            if (e.target.checked) {
                if (selectedCandidates.size < MAX_SELECTION) {
                    selectedCandidates.add(candidateId);
                } else {
                    // Prevent checking if max selection reached
                    e.target.checked = false;
                    showAlert(`You can select up to ${MAX_SELECTION} candidates.`);
                }
            } else {
                selectedCandidates.delete(candidateId);
            }
    
            updateCounter();
            updateCheckboxState();
        }
    });
    
    /**
     * Update the selection counter and submit button state
     */
    function updateCounter() {
        selectedCountSpan.textContent = selectedCandidates.size;
        submitVoteButton.disabled = selectedCandidates.size === 0;
    }
    
    /**
     * Disable or enable checkboxes based on selection count
     */
    function updateCheckboxState() {
        const checkboxes = document.querySelectorAll('.vote-checkbox');
        if (selectedCandidates.size >= MAX_SELECTION) {
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                    checkbox.parentElement.style.opacity = 0.6;
                }
            });
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.disabled = false;
                checkbox.parentElement.style.opacity = 1;
            });
        }
    }
    
    /**
     * Select All button functionality
     */
    selectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.vote-checkbox');
        let selectedCountBefore = selectedCandidates.size;
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked && !checkbox.disabled && selectedCountBefore < MAX_SELECTION) {
                checkbox.checked = true;
                const candidateId = parseInt(checkbox.getAttribute('data-id'));
                selectedCandidates.add(candidateId);
                selectedCountBefore++;
            }
        });
        updateCounter();
        updateCheckboxState();
    });
    
    /**
     * Deselect All button functionality
     */
    deselectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.vote-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                const candidateId = parseInt(checkbox.getAttribute('data-id'));
                selectedCandidates.delete(candidateId);
            }
        });
        updateCounter();
        updateCheckboxState();
    });
    
    /**
     * Submit vote button click handler
     */
    submitVoteButton.addEventListener('click', () => {
        if (selectedCandidates.size > 0) {
            openConfirmationModal();
        }
    });
    
    /**
     * Function to open the confirmation modal
     */
    function openConfirmationModal() {
        confirmationModal.style.display = "block";
        // Trap focus within the modal for accessibility
        trapFocus(confirmationModal);
    }
    
    /**
     * Close confirmation modal
     */
    const closeConfirmationButtons = confirmationModal.querySelectorAll('.close-button');
    closeConfirmationButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeConfirmationModal();
        });
    });
    
    /**
     * Function to close the confirmation modal
     */
    function closeConfirmationModal() {
        confirmationModal.style.display = "none";
        // Clear form and errors
        voterForm.reset();
        clearErrors();
    }
    
    /**
     * Handle form submission
     */
    voterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        const isValid = validateForm();
        if (isValid) {
            // Proceed to submit the vote
            submitVote();
        }
    });
    
    /**
     * Function to validate form inputs
     */
    function validateForm() {
        let isValid = true;
    
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
    
        // Validate First Name
        if (firstNameInput.value.trim() === "") {
            showError('firstNameError', 'First name is required.');
            isValid = false;
        }
    
        // Validate Last Name
        if (lastNameInput.value.trim() === "") {
            showError('lastNameError', 'Last name is required.');
            isValid = false;
        }
    
        // Validate Email
        if (emailInput.value.trim() === "") {
            showError('emailError', 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError('emailError', 'Please enter a valid email address.');
            isValid = false;
        }
    
        return isValid;
    }
    
    /**
     * Helper function to show error messages
     * @param {string} elementId - The ID of the error message element
     * @param {string} message - The error message to display
     */
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }
    
    /**
     * Helper function to clear error messages
     */
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(span => {
            span.textContent = '';
        });
    }
    
    /**
     * Helper function to validate email format
     * @param {string} email - The email address to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    function isValidEmail(email) {
        // Simple email regex
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
    /**
     * Function to submit the vote (Placeholder for backend integration)
     */
    function submitVote() {
        // Gather voter information
        const voterData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            votes: Array.from(selectedCandidates)
        };
    
        console.log('Voter Data:', voterData);
    
        // TODO: Integrate with backend API to store voter data and votes securely
    
        // Close the confirmation modal and open success modal
        closeConfirmationModal();
        openSuccessModal();
    }
    
    /**
     * Success modal functionality
     */
    function openSuccessModal() {
        successModal.style.display = "block";
        trapFocus(successModal);
    }
    
    const closeSuccessButtons = successModal.querySelectorAll('.close-button');
    closeSuccessButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeSuccessModal();
        });
    });
    
    document.getElementById('closeSuccessModal').addEventListener('click', () => {
        closeSuccessModal();
    });
    
    /**
     * Function to close the success modal
     */
    function closeSuccessModal() {
        successModal.style.display = "none";
        // Optionally, reset selections after submission
        resetSelections();
        // Return focus to the Submit Vote button
        submitVoteButton.focus();
    }
    
    /**
     * Function to reset all selections
     */
    function resetSelections() {
        selectedCandidates.clear();
        updateCounter();
        // Re-fetch candidates to reset their display
        const searchTerm = searchBar.value.toLowerCase();
        const filtered = candidates.filter(candidate => candidate.name.toLowerCase().includes(searchTerm));
        displayCandidates(filtered);
    }
    
    /**
     * Function to show alert messages
     * @param {string} message - The alert message to display
     */
    function showAlert(message) {
        // Create a temporary alert div
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert');
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
    
        // Show the alert with animation
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10); // Allow DOM to render
    
        // Hide the alert after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            // Remove the alert from DOM after transition
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Function to open candidate details modal
     * @param {Object} candidate - The candidate object containing details
     */
    function openDetailsModal(candidate) {
        detailsContent.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name}">
            <h3>${candidate.name}</h3>
            <p><strong>Party:</strong> ${candidate.party}</p>
            <p><strong>Bio:</strong> ${candidate.bio}</p>
        `;
        detailsModal.style.display = "block";
        trapFocus(detailsModal);
    }
    
    /**
     * Close details modal
     */
    const closeDetailsButtons = detailsModal.querySelectorAll('.close-button');
    closeDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeDetailsModal();
        });
    });
    
    /**
     * Function to close the details modal
     */
    function closeDetailsModal() {
        detailsModal.style.display = "none";
    }
    
    /**
     * Alert styling (if not included in CSS)
     */
    const style = document.createElement('style');
    style.innerHTML = `
    .alert {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100%);
        background-color: #ff4d4d;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1500;
    }
    
    .alert.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    `;
    document.head.appendChild(style);
    
    /**
     * Function to trap focus within a modal for accessibility
     * @param {HTMLElement} element - The modal element
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) return; // No focusable elements
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length -1];
    
        function handleFocus(e) {
            const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);
    
            if (!isTabPressed) return;
    
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    
        element.addEventListener('keydown', handleFocus);
    
        // Focus the first element in the modal
        firstElement.focus();
    
        // Remove the event listener when modal is closed
        function cleanup() {
            element.removeEventListener('keydown', handleFocus);
        }
    
        // Attach cleanup to close button clicks
        const closeButtons = element.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', cleanup);
        });
    
        // Also clean up when the modal is closed by clicking outside
        element.addEventListener('click', (e) => {
            if (e.target === element) {
                closeModal(element);
                cleanup();
            }
        });
    }
    
    /**
     * General function to close any modal
     * @param {HTMLElement} modal - The modal element to close
     */
    function closeModal(modal) {
        modal.style.display = "none";
    }
    
    // Initialize by fetching candidate images
    fetchCandidateImages();
});
