import admin from 'firebase-admin';
import config from '../../../config.js';
import { db } from '../setup.js';
import { collection, getDocs} from 'firebase/firestore';
import { isSlotAvailable, createCalendarEvent} from '../../utils/googleCalendar.js';
